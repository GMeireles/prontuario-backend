#!/usr/bin/env node
/**
 * Smoke tests Fase 6 — Pacientes + AASI
 * Executar: cd back-end && node scripts/phase6-smoke.js
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
const created = { patientId: null, aasiId: null };

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

async function authGet(token, url, tenantId) {
  const headers = { Authorization: `Bearer ${token}` };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${url}`, { headers });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function authPost(token, url, tenantId, payload = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function authPut(token, url, tenantId, payload = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${url}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function authDelete(token, url, tenantId) {
  const headers = { Authorization: `Bearer ${token}` };
  if (tenantId) headers['X-Tenant-ID'] = String(tenantId);
  const res = await fetch(`${BASE}${url}`, { method: 'DELETE', headers });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function run() {
  try {
    const adminTokens = await login('admin');
    const adminMe = await authGet(adminTokens.accessToken, '/auth/me');
    if (adminMe.res.ok) pass('login admin + /auth/me');
    else fail('login admin + /auth/me', adminMe.body.message);

    const tenantId = adminMe.body.data?.tenant_id || 1;

    const list = await authGet(adminTokens.accessToken, '/patients?page=1&limit=5', tenantId);
    if (list.res.ok && list.body.success && Array.isArray(list.body.data)) pass('listar pacientes paginado');
    else fail('listar pacientes paginado', list.body.message);

    const cpf = `${Date.now()}`.slice(-11).padStart(11, '0');
    const create = await authPost(adminTokens.accessToken, '/patients', tenantId, {
      name: `Smoke P6 ${Date.now()}`,
      cpf,
      birth_date: '1990-05-10',
      gender: 'O',
      phone: '11999990000',
    });
    if (create.res.ok && create.body.data?.id) {
      created.patientId = create.body.data.id;
      pass('criar paciente');
    } else fail('criar paciente', create.body.message);

    const pid = created.patientId;
    if (pid) {
      const update = await authPut(adminTokens.accessToken, `/patients/${pid}`, tenantId, {
        notes: 'Obs smoke fase 6',
        rg: '123456',
      });
      if (update.res.ok) pass('editar paciente');
      else fail('editar paciente', update.body.message);

      const detail = await authGet(adminTokens.accessToken, `/patients/${pid}`, tenantId);
      if (detail.res.ok) pass('abrir detalhe do paciente');
      else fail('abrir detalhe do paciente', detail.body.message);

      const summary = await authGet(adminTokens.accessToken, `/patients/${pid}/summary`, tenantId);
      if (summary.res.ok && summary.body.data?.counts) pass('ver resumo do paciente');
      else fail('ver resumo do paciente', summary.body.message);

      const aasiCreate = await authPost(adminTokens.accessToken, `/patients/${pid}/aasis`, tenantId, {
        ear: 'right',
        brand: 'Marca Teste',
        model: 'Modelo X',
        serial_number: `SN${Date.now()}`,
      });
      if (aasiCreate.res.ok && aasiCreate.body.data?.id) {
        created.aasiId = aasiCreate.body.data.id;
        pass('criar AASI');
      } else fail('criar AASI', aasiCreate.body.message);

      const aasiList = await authGet(adminTokens.accessToken, `/patients/${pid}/aasis`, tenantId);
      if (aasiList.res.ok && Array.isArray(aasiList.body.data) && aasiList.body.data.length > 0) {
        pass('listar AASI de paciente');
      } else fail('listar AASI de paciente', aasiList.body.message);

      if (created.aasiId) {
        const aasiUpdate = await authPut(
          adminTokens.accessToken,
          `/patients/${pid}/aasis/${created.aasiId}`,
          tenantId,
          { power: '60dB' }
        );
        if (aasiUpdate.res.ok) pass('editar AASI');
        else fail('editar AASI', aasiUpdate.body.message);

        const aasiDeactivate = await authDelete(
          adminTokens.accessToken,
          `/patients/${pid}/aasis/${created.aasiId}`,
          tenantId
        );
        if (aasiDeactivate.res.ok) pass('arquivar/desativar AASI');
        else fail('arquivar/desativar AASI', aasiDeactivate.body.message);
      }
    }

    const proTokens = await login('professional');
    const proMe = await authGet(proTokens.accessToken, '/auth/me');
    const proPerms = proMe.body.data?.permissions || [];
    if (proPerms.includes('aasis.view') && !proPerms.includes('patients.create')) {
      pass('permissões professional (view pacientes, AASI create)');
    } else fail('permissões professional', proPerms.join(','));

    const proCreatePatient = await authPost(proTokens.accessToken, '/patients', tenantId, {
      name: 'Pro Block',
      cpf: '11111111111',
      birth_date: '1990-01-01',
      gender: 'M',
    });
    if (proCreatePatient.res.status === 403) pass('professional bloqueado criar paciente');
    else fail('professional bloqueado criar paciente', String(proCreatePatient.res.status));

    const recTokens = await login('receptionist');
    const recMe = await authGet(recTokens.accessToken, '/auth/me');
    const recPerms = recMe.body.data?.permissions || [];
    if (recPerms.includes('patients.create') && recPerms.includes('aasis.create')) {
      pass('permissões receptionist');
    } else fail('permissões receptionist', recPerms.join(','));

    if (pid) {
      const wrongTenant = await authGet(adminTokens.accessToken, `/patients/${pid}/aasis`, 99999);
      if (wrongTenant.res.status === 403) pass('bloquear AASI de outro tenant');
      else fail('bloquear AASI de outro tenant', String(wrongTenant.res.status));
    }

    const appts = await authGet(adminTokens.accessToken, '/appointments', tenantId);
    if (appts.res.ok) pass('agenda ainda funcionando');
    else fail('agenda ainda funcionando', appts.body.message);

    const anamneses = await authGet(adminTokens.accessToken, `/anamneses/patient/${pid || 1}`, tenantId);
    if ([200, 404].includes(anamneses.res.status)) pass('anamnese ainda funcionando');
    else fail('anamnese ainda funcionando', String(anamneses.res.status));

    const evolutions = await authGet(adminTokens.accessToken, `/evolutions/patient/${pid || 1}`, tenantId);
    if ([200, 404].includes(evolutions.res.status)) pass('evoluções ainda funcionando');
    else fail('evoluções ainda funcionando', String(evolutions.res.status));

    const files = await authGet(adminTokens.accessToken, `/files/patient/${pid || 1}`, tenantId);
    if (files.res.ok || files.res.status === 404) pass('arquivos ainda funcionando');
    else fail('arquivos ainda funcionando', String(files.res.status));

    const prescriptions = await authGet(adminTokens.accessToken, `/prescriptions/${pid || 1}`, tenantId);
    if (prescriptions.res.ok) pass('prescrições ainda funcionando');
    else fail('prescrições ainda funcionando', prescriptions.body.message);

    if (pid) {
      const archive = await authDelete(adminTokens.accessToken, `/patients/${pid}`, tenantId);
      if (archive.res.ok) pass('arquivar/desativar paciente');
      else fail('arquivar/desativar paciente', archive.body.message);
    }

    const db = (await import('../src/models/index.js')).default;
    await db.sequelize.close();
  } catch (err) {
    fail('smoke runner', err.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

run();
