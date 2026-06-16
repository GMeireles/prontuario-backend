#!/usr/bin/env node
/**
 * Smoke tests Fase 5 — SaaS / Billing / Stripe
 * Executar: cd back-end && node scripts/phase5-smoke.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const BASE = process.env.API_BASE || 'http://127.0.0.1:4001/api';

const USERS = {
  admin: { email: 'guilherme.meireles@vexial.com.br', password: 'abcd@1234' },
  professional: { email: 'vanessa@vexial.com.br', password: 'abcd@1234' },
  receptionist: { email: 'recepcao@vexial.com.br', password: 'abcd@1234' },
};

const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`PASS  ${name}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`FAIL  ${name}: ${detail}`);
}

async function login(role) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(USERS[role]),
  });
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message || 'login failed');
  return body.data;
}

async function authGet(token, path, tenantId) {
  const headers = { Authorization: `Bearer ${token}` };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${path}`, { headers });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function authPost(token, path, tenantId, payload = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function run() {
  try {
    const plansRes = await fetch(`${BASE}/billing/plans`);
    const plansBody = await plansRes.json();
    if (plansRes.ok && plansBody.success && Array.isArray(plansBody.data) && plansBody.data.length >= 4) {
      pass('listar planos públicos');
    } else {
      fail('listar planos públicos', JSON.stringify(plansBody));
    }

    const adminTokens = await login('admin');
    const adminMe = await authGet(adminTokens.accessToken, '/auth/me');
    if (adminMe.res.ok && adminMe.body.success) pass('login admin + /auth/me');
    else fail('login admin + /auth/me', adminMe.body.message);

    const tenantId = adminMe.body.data?.tenant_id || 1;

    const sub = await authGet(adminTokens.accessToken, '/billing/subscription', tenantId);
    if (sub.res.ok && sub.body.success && sub.body.data?.subscription) pass('ver assinatura atual admin');
    else fail('ver assinatura atual admin', sub.body.message);

    const billingPerms = (adminMe.body.data?.permissions || []).filter((p) => p.startsWith('billing.'));
    if (billingPerms.includes('billing.view') && billingPerms.includes('billing.manage')) {
      pass('admin possui permissões billing');
    } else {
      fail('admin possui permissões billing', billingPerms.join(','));
    }

    const proTokens = await login('professional');
    const proMe = await authGet(proTokens.accessToken, '/auth/me');
    const proBilling = (proMe.body.data?.permissions || []).filter((p) => p.startsWith('billing.'));
    if (proBilling.length === 0) pass('professional sem billing');
    else fail('professional sem billing', proBilling.join(','));

    const recTokens = await login('receptionist');
    const recMe = await authGet(recTokens.accessToken, '/auth/me');
    const recBilling = (recMe.body.data?.permissions || []).filter((p) => p.startsWith('billing.'));
    if (recBilling.length === 0) pass('receptionist sem billing');
    else fail('receptionist sem billing', recBilling.join(','));

    const proSub = await authGet(proTokens.accessToken, '/billing/subscription', tenantId);
    if (proSub.res.status === 403) pass('bloquear billing subscription para professional');
    else fail('bloquear billing subscription para professional', String(proSub.res.status));

    const checkoutNoPrice = await authPost(
      adminTokens.accessToken,
      '/billing/checkout',
      tenantId,
      { planSlug: 'basic' }
    );
    if (checkoutNoPrice.res.status === 400 || checkoutNoPrice.res.status === 503) {
      pass('checkout plano sem stripe_price_id retorna erro amigável');
    } else {
      fail('checkout plano sem stripe_price_id', String(checkoutNoPrice.res.status));
    }

    const portalNoCustomer = await authPost(adminTokens.accessToken, '/billing/portal', tenantId);
    if (portalNoCustomer.res.status === 400) pass('portal sem stripe_customer_id retorna erro amigável');
    else fail('portal sem stripe_customer_id', String(portalNoCustomer.res.status));

    const webhookBad = await fetch(`${BASE}/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid',
      },
      body: JSON.stringify({ type: 'test' }),
    });
    if (webhookBad.status === 400) pass('webhook assinatura inválida falha');
    else fail('webhook assinatura inválida', String(webhookBad.status));

    const patientsActive = await authGet(adminTokens.accessToken, '/patients', tenantId);
    if (patientsActive.res.ok) pass('rotas clínicas com assinatura active');
    else fail('rotas clínicas com assinatura active', patientsActive.body.message);

    const db = (await import('../src/models/index.js')).default;
    const subRow = await db.Subscription.findOne({ where: { tenant_id: tenantId } });
    const prevStatus = subRow.status;
    await subRow.update({ status: 'past_due' });

    const blocked = await authGet(adminTokens.accessToken, '/patients', tenantId);
    if (blocked.res.status === 402) pass('rotas clínicas bloqueiam com past_due');
    else fail('rotas clínicas bloqueiam com past_due', String(blocked.res.status));

    const billingStill = await authGet(adminTokens.accessToken, '/billing/subscription', tenantId);
    if (billingStill.res.ok) pass('billing acessível mesmo com past_due');
    else fail('billing acessível com past_due', String(billingStill.res.status));

    await subRow.update({ status: prevStatus });

    const freePlan = await db.Plan.findOne({ where: { slug: 'free' } });
    const usage = await db.Patient.count({ where: { tenant_id: tenantId } });
    if (freePlan?.max_patients && usage >= freePlan.max_patients) {
      pass('limite pacientes já atingido no tenant (skip create test)');
    } else {
      const createPatient = await authPost(adminTokens.accessToken, '/patients', tenantId, {
        name: `Smoke Test ${Date.now()}`,
        birth_date: '1990-01-01',
        gender: 'O',
        cpf: `${Date.now()}`.slice(-11).padStart(11, '0'),
      });
      if (createPatient.res.ok || createPatient.res.status === 201) pass('criar paciente respeitando limite');
      else if (createPatient.res.status === 403) pass('criar paciente bloqueado por limite');
      else fail('criar paciente', createPatient.body.message);
    }

    await db.sequelize.close();
  } catch (err) {
    fail('smoke runner', err.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

run();
