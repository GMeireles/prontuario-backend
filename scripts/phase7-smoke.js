#!/usr/bin/env node
/**
 * Smoke tests Fase 7 — Anamnese flexível + assinatura digital
 * Executar: cd back-end && node scripts/phase7-smoke.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const BASE = process.env.API_BASE || 'http://127.0.0.1:4001/api';
const CONFIRMATION = 'Eu confirmo a veracidade das informações';

const USERS = {
  admin: { email: 'guilherme.meireles@vexial.com.br', password: 'abcd@1234' },
  professional: { email: 'vanessa@vexial.com.br', password: 'abcd@1234' },
  receptionist: { email: 'recepcao@vexial.com.br', password: 'abcd@1234' },
};

const results = [];
const created = { patientId: null, anamneseId: null, templateId: null };

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
    const adminPerms = adminMe.body.data?.permissions || [];
    if (adminPerms.includes('anamnese_templates.view') && adminPerms.includes('signatures.create')) {
      pass('permissões admin fase 7');
    } else fail('permissões admin fase 7', adminPerms.join(','));

    const templates = await authGet(adminTokens.accessToken, '/anamnese-templates', tenantId);
    if (templates.res.ok && Array.isArray(templates.body.data)) {
      pass('listar templates de anamnese');
      const def = templates.body.data.find((t) => t.is_default);
      if (def) {
        created.templateId = def.id;
        pass('template padrão existe');
      } else fail('template padrão existe', 'nenhum is_default');
    } else fail('listar templates de anamnese', templates.body.message);

    const cpf = `${Date.now()}`.slice(-11).padStart(11, '0');
    const createPatient = await authPost(adminTokens.accessToken, '/patients', tenantId, {
      name: `Smoke P7 ${Date.now()}`,
      cpf,
      birth_date: '1990-05-10',
      gender: 'O',
      phone: '11999990000',
    });
    if (createPatient.res.ok && createPatient.body.data?.id) {
      created.patientId = createPatient.body.data.id;
      pass('criar paciente smoke');
    } else fail('criar paciente smoke', createPatient.body.message);

    const pid = created.patientId;

    const legacyCreate = await authPost(adminTokens.accessToken, `/anamneses/patient/${pid}`, tenantId, {
      main_complaint: 'Queixa legada smoke',
      medical_history: 'Histórico',
      allergies: 'Nenhuma',
    });
    if (legacyCreate.res.ok && legacyCreate.body.data?.isLegacy === true) {
      created.anamneseId = legacyCreate.body.data.id;
      pass('criar anamnese legada');
    } else fail('criar anamnese legada', legacyCreate.body.message);

    if (created.anamneseId) {
      const legacyGet = await authGet(adminTokens.accessToken, `/anamneses/patient/${pid}`, tenantId);
      if (legacyGet.res.ok && legacyGet.body.data?.isLegacy === true) {
        pass('GET anamnese legada enriquecida');
      } else fail('GET anamnese legada enriquecida', legacyGet.body.message);

      const legacyUpdate = await authPut(
        adminTokens.accessToken,
        `/anamneses/${created.anamneseId}`,
        tenantId,
        { main_complaint: 'Queixa legada atualizada' }
      );
      if (legacyUpdate.res.ok) pass('atualizar anamnese legada');
      else fail('atualizar anamnese legada', legacyUpdate.body.message);

      const sign = await authPost(
        adminTokens.accessToken,
        `/anamneses/${created.anamneseId}/sign`,
        tenantId,
        { typedName: 'Admin Smoke', confirmationText: CONFIRMATION }
      );
      if (sign.res.ok && sign.body.data?.locked_at) pass('assinar anamnese legada');
      else fail('assinar anamnese legada', sign.body.message);

      const blockUpdate = await authPut(
        adminTokens.accessToken,
        `/anamneses/${created.anamneseId}`,
        tenantId,
        { main_complaint: 'Tentativa bloqueada' }
      );
      if (blockUpdate.res.status === 403) pass('bloquear edição pós-assinatura');
      else fail('bloquear edição pós-assinatura', String(blockUpdate.res.status));

      const sigList = await authGet(adminTokens.accessToken, `/patients/${pid}/signatures`, tenantId);
      if (sigList.res.ok && Array.isArray(sigList.body.data) && sigList.body.data.length > 0) {
        pass('listar assinaturas do paciente');
        const sigId = sigList.body.data[0].id;
        const sigDetail = await authGet(adminTokens.accessToken, `/signatures/${sigId}`, tenantId);
        if (sigDetail.res.ok) pass('detalhe assinatura');
        else fail('detalhe assinatura', sigDetail.body.message);
      } else fail('listar assinaturas do paciente', sigList.body.message);
    }

    const cpf2 = `${Date.now() + 1}`.slice(-11).padStart(11, '0');
    const p2 = await authPost(adminTokens.accessToken, '/patients', tenantId, {
      name: `Smoke P7 Flex ${Date.now()}`,
      cpf: cpf2,
      birth_date: '1985-03-20',
      gender: 'F',
    });
    const pid2 = p2.body.data?.id;

    if (pid2 && created.templateId) {
      const flexCreate = await authPost(adminTokens.accessToken, `/anamneses/patient/${pid2}`, tenantId, {
        templateId: created.templateId,
        answers: {
          queixa_principal: 'Dificuldade para ouvir',
          historico_medico: 'Sem comorbidades',
          exposicao_ruido: true,
          zumbido: false,
        },
      });
      if (flexCreate.res.ok && flexCreate.body.data?.isLegacy === false) {
        pass('criar anamnese flexível');
        if (flexCreate.body.data.main_complaint === 'Dificuldade para ouvir') {
          pass('espelhar queixa_principal em main_complaint');
        } else fail('espelhar queixa_principal em main_complaint', flexCreate.body.data.main_complaint);
      } else fail('criar anamnese flexível', flexCreate.body.message);

      const flexId = flexCreate.body.data?.id;
      if (flexId) {
        const flexUpdate = await authPut(adminTokens.accessToken, `/anamneses/${flexId}`, tenantId, {
          answers: { queixa_principal: 'Queixa flex atualizada', tontura: true },
        });
        if (flexUpdate.res.ok) pass('atualizar anamnese flexível');
        else fail('atualizar anamnese flexível', flexUpdate.body.message);
      }
    }

    const proTokens = await login('professional');
    const proMe = await authGet(proTokens.accessToken, '/auth/me');
    const proPerms = proMe.body.data?.permissions || [];
    if (proPerms.includes('anamnese_templates.view') && !proPerms.includes('anamnese_templates.create')) {
      pass('professional view-only templates');
    } else fail('professional view-only templates', proPerms.join(','));

    const proTemplates = await authGet(proTokens.accessToken, '/anamnese-templates', tenantId);
    if (proTemplates.res.ok) pass('professional lista templates');
    else fail('professional lista templates', proTemplates.body.message);

    const proCreateTpl = await authPost(proTokens.accessToken, '/anamnese-templates', tenantId, {
      name: 'Pro Block Template',
    });
    if (proCreateTpl.res.status === 403) pass('professional bloqueado criar template');
    else fail('professional bloqueado criar template', String(proCreateTpl.res.status));

    const recTokens = await login('receptionist');
    const recMe = await authGet(recTokens.accessToken, '/auth/me');
    const recPerms = recMe.body.data?.permissions || [];
    if (!recPerms.includes('anamneses.view') && !recPerms.includes('anamnese_templates.view')) {
      pass('receptionist sem anamnese/templates');
    } else fail('receptionist sem anamnese/templates', recPerms.join(','));

    const recAnamnese = await authGet(recTokens.accessToken, `/anamneses/patient/${pid}`, tenantId);
    if (recAnamnese.res.status === 403) pass('receptionist bloqueado ver anamnese');
    else fail('receptionist bloqueado ver anamnese', String(recAnamnese.res.status));

    const appts = await authGet(adminTokens.accessToken, '/appointments', tenantId);
    if (appts.res.ok) pass('agenda regressão');
    else fail('agenda regressão', appts.body.message);

    const summary = await authGet(adminTokens.accessToken, `/patients/${pid}/summary`, tenantId);
    if (summary.res.ok) pass('resumo paciente regressão');
    else fail('resumo paciente regressão', summary.body.message);

    const aasis = await authGet(adminTokens.accessToken, `/patients/${pid}/aasis`, tenantId);
    if (aasis.res.ok) pass('AASI regressão');
    else fail('AASI regressão', aasis.body.message);

    const evolutions = await authGet(adminTokens.accessToken, `/evolutions/patient/${pid}`, tenantId);
    if ([200, 404].includes(evolutions.res.status)) pass('evoluções regressão');
    else fail('evoluções regressão', String(evolutions.res.status));

    const files = await authGet(adminTokens.accessToken, `/files/patient/${pid}`, tenantId);
    if (files.res.ok || files.res.status === 404) pass('arquivos regressão');
    else fail('arquivos regressão', String(files.res.status));

    const prescriptions = await authGet(adminTokens.accessToken, `/prescriptions/${pid}`, tenantId);
    if (prescriptions.res.ok) pass('prescrições regressão');
    else fail('prescrições regressão', prescriptions.body.message);

    if (pid2) {
      await authDelete(adminTokens.accessToken, `/patients/${pid2}`, tenantId);
    }
    if (pid) {
      await authDelete(adminTokens.accessToken, `/patients/${pid}`, tenantId);
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
