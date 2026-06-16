# PHASE_7_ANAMNESE_SIGNATURE_REPORT.md

> Fase 7 — Anamnese Flexível + Assinatura Digital | Data: 2026-06-16

## Branches

| Repositório | Branch |
|-------------|--------|
| `back-end/` | `feature/prontuario-modernizacao` |
| `front-end/` | `feature/refactor-frontend-base` |

---

## Resumo

Anamnese evoluída para suportar **templates flexíveis** com respostas dinâmicas (`anamnese_answers`) e **assinatura digital auditável** (tipo `typed` + hash SHA-256). Anamneses legadas (`template_id IS NULL`, 5 campos TEXT) permanecem 100% compatíveis. Novas rotas de templates, assinatura e extensões em `/api/anamneses/*` sem quebrar integrações das fases anteriores.

---

## Auditoria baseline (pré-Fase 7)

| Item | Estado anterior |
|------|-----------------|
| `anamneses` | 5 campos TEXT fixos + `main_complaint NOT NULL` |
| Templates / assinaturas | Inexistentes |
| `getByPatient` | `findOne` simples, sem enriquecimento |
| Frontend | 5 `FormTextarea` hardcoded em `AnamneseTab.vue` |
| Settings | Sem gestão de templates |
| Receptionist | Já sem `anamneses.*` |

---

## Migrations criadas

| Arquivo | Alteração |
|---------|-----------|
| `20260618000001-create-anamnese-templates.js` | `anamnese_templates` |
| `20260618000002-create-anamnese-template-fields.js` | `anamnese_template_fields` |
| `20260618000003-create-digital-signatures.js` | `digital_signatures` |
| `20260618000004-add-anamnese-flex-signature-fields.js` | `template_id`, `signed_at`, `signed_by`, `signature_id`, `locked_at` |
| `20260618000005-create-anamnese-answers.js` | `anamnese_answers` |
| `20260618000006-relax-anamnese-legacy-nullability.js` | `main_complaint` nullable |

**Sem** migração automática de anamneses antigas para answers.

---

## Models criados / alterados

| Model | Função |
|-------|--------|
| `AnamneseTemplate.js` | Templates por tenant |
| `AnamneseTemplateField.js` | Campos do template |
| `AnamneseAnswer.js` | Respostas por `field_key` |
| `DigitalSignature.js` | Assinaturas (`entity_type` + `entity_id`) |
| `Anamnese.js` | Novos campos + associações |

Registrados em `tenantScopedModels`: `AnamneseTemplate`, `AnamneseTemplateField`, `AnamneseAnswer`, `DigitalSignature`.

---

## Services

| Service | Responsabilidade |
|---------|------------------|
| `anamneseTemplateService` | CRUD templates/fields, `setDefault`, soft deactivate |
| `anamneseAnswerService` | Upsert answers, validação required/types |
| `digitalSignatureService` | Assinatura typed, hash canônico, IP/UA |
| `anamneseService` | Create/update flexível + legado, `sign()`, bloqueio pós-assinatura |

---

## Rotas

### Templates (`/api/anamnese-templates`)

CRUD templates + CRUD fields (soft delete). Permissões: admin gerencia; professional view-only.

### Anamneses (estendidas)

| Método | Rota | Alteração |
|--------|------|-----------|
| POST | `/api/anamneses/patient/:patientId` | Aceita `{ templateId?, answers? }` ou payload legado |
| PUT | `/api/anamneses/:id` | Answers flexíveis; rejeita se `locked_at` |
| POST | `/api/anamneses/:id/sign` | Assinatura digital typed |

### Assinaturas

| Método | Rota |
|--------|------|
| GET | `/api/patients/:patientId/signatures` |
| GET | `/api/signatures/:id` |

---

## Permissões novas

| Permissão | Admin | Professional | Receptionist |
|-----------|-------|--------------|--------------|
| `anamnese_templates.view` | ✅ | ✅ | ❌ |
| `anamnese_templates.create/update/delete` | ✅ | ❌ | ❌ |
| `signatures.view` | ✅ | ✅ | ❌ |
| `signatures.create` | ✅ | ✅ | ❌ |

---

## Seeder

`20260618000001-default-anamnese-template.js` — **Anamnese Audiológica Padrão** (`is_default: true`) por tenant, idempotente, 10 campos (queixa, históricos, booleanos audiológicos, observações).

---

## Frontend

| Arquivo | Função |
|---------|--------|
| `DynamicFormRenderer.vue` | Renderização por `type` |
| `AnamneseLegacyView.vue` | Visualização legada |
| `AnamneseSignatureModal.vue` | Assinatura typed |
| `AnamneseTab.vue` | Legado vs flexível, badges, sign |
| `AnamneseTemplatesView.vue` | Admin CRUD templates/fields |
| `api/anamneseTemplates.js`, `api/signatures.js` | Novos clients |

Rota: `/app/settings/anamnese-templates` + link no menu Administração.

---

## Assinatura digital (limitações Fase 7)

- Tipo suportado: **`typed`** (nome + confirmação textual fixa)
- `document_hash`: SHA-256 de snapshot canônico (colunas legadas ou answers ordenados)
- Pós-assinatura: `locked_at` bloqueia update/delete
- **Não** ICP-Brasil; **não** reabertura
- `digital_signatures.entity_type=evolution` preparado na DB, **sem endpoint** (pendência Fase 8+)

---

## Validação

```bash
cd back-end && npm run migrate
cd back-end && npx sequelize-cli db:seed --seed 20260618000001-default-anamnese-template.js
cd back-end && node server.js
cd back-end && node scripts/phase7-smoke.js   # 26/26 passed
cd front-end && npm run build                 # OK
```

---

## Pendências / Fase 8+

- Assinatura canvas (`drawn` / `uploaded`)
- Endpoint de assinatura para evoluções
- Reabertura pós-assinatura com trilha de auditoria
- Drag-and-drop de ordem de campos no admin
