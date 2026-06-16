# PHASE_6_PATIENTS_AASI_REPORT.md

> Fase 6 — Pacientes + AASI / Aparelhos Auditivos | Data: 2026-06-16

## Branches

| Repositório | Branch |
|-------------|--------|
| `back-end/` | `feature/prontuario-modernizacao` |
| `front-end/` | `feature/refactor-frontend-base` |

---

## Resumo

Módulo de pacientes evoluído com filtros, paginação, arquivamento e CPF único por tenant. Implementado cadastro de múltiplos AASI/aparelhos auditivos por paciente, resumo clínico básico e novas abas no prontuário, respeitando tenant, permissões e contrato API padronizado.

---

## Auditoria baseline (pré-Fase 6)

| Item | Estado anterior |
|------|-----------------|
| `patients` | 13 campos, sem `rg`/`notes`/`active`/`archived_at` |
| CPF | Unique global |
| Listagem | `findAll` sem filtros/paginação |
| Delete | Hard delete com CASCADE |
| Validators | Comentados (vazios) |
| AASI | Inexistente |
| Frontend listagem | Busca client-side |
| Prontuário | 5 abas (sem Resumo, Agenda, AASI) |
| Professional | `patients.create/update` |

---

## Migrations criadas

| Arquivo | Alteração |
|---------|-----------|
| `20260617000001-add-patient-fields-and-archive.js` | `rg`, `notes`, `active`, `archived_at` |
| `20260617000002-patient-cpf-unique-per-tenant.js` | Unique `(tenant_id, cpf)` |
| `20260617000003-create-patient-aasis.js` | Tabela `patient_aasis` |

---

## Models criados / alterados

| Model | Alteração |
|-------|-----------|
| `Patient.js` | Novos campos, associações clínicas + `aasis`, index composto CPF |
| `PatientAasi.js` | Novo |
| `Tenant.js` | `hasMany PatientAasi` |

`PatientAasi` registrado em `tenantScopedModels`.

---

## Services criados / alterados

| Service | Função |
|---------|--------|
| `patientService.js` | Filtros, paginação, archive, CPF por tenant |
| `patientSummaryService.js` | Resumo com contagens e próxima consulta |
| `patientAasiService.js` | CRUD AASI com soft deactivate |

---

## Rotas criadas / alteradas

### Pacientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/patients` | Listagem paginada com filtros |
| GET | `/api/patients/:id/summary` | Resumo clínico |
| DELETE | `/api/patients/:id` | Arquivar ou remover |

Query params listagem: `q`, `cpf`, `phone`, `active`, `sort`, `order`, `page`, `limit`.

### AASI (aninhadas)

| Método | Rota | Permissão |
|--------|------|-----------|
| GET | `/api/patients/:patientId/aasis` | `aasis.view` |
| POST | `/api/patients/:patientId/aasis` | `aasis.create` |
| GET | `/api/patients/:patientId/aasis/:aasiId` | `aasis.view` |
| PUT | `/api/patients/:patientId/aasis/:aasiId` | `aasis.update` |
| DELETE | `/api/patients/:patientId/aasis/:aasiId` | `aasis.delete` (soft) |

---

## Permissões novas / ajustadas

| Permissão | Admin | Professional | Receptionist |
|-----------|-------|--------------|--------------|
| `patients.view` | ✅ | ✅ | ✅ |
| `patients.create` | ✅ | ❌ | ✅ |
| `patients.update` | ✅ | ❌ | ✅ |
| `patients.delete` | ✅ | ❌ | ❌ |
| `aasis.view` | ✅ | ✅ | ✅ |
| `aasis.create` | ✅ | ✅ | ✅ |
| `aasis.update` | ✅ | ✅ | ✅ |
| `aasis.delete` | ✅ | ❌ | ❌ |

---

## Frontend

| Item | Detalhe |
|------|---------|
| `api/patients.js` | Paginação, summary, archive |
| `api/patientAasis.js` | CRUD AASI |
| `api/response.js` | `unwrapPaginated` |
| `PacientesView.vue` | Filtros server-side, paginação, arquivar |
| `PatientModal.vue` | RG, notes, validações |
| `ProntuarioView.vue` | Abas: Resumo, Dados, Anamnese, Evoluções, Agenda, Arquivos, Prescrições, AASI |
| `PatientSummaryTab.vue` | Cards de resumo |
| `PatientDataTab.vue` | Dados cadastrais |
| `PatientAppointmentsTab.vue` | Agenda do paciente |
| `PatientAasiTab.vue` + `PatientAasiModal.vue` | CRUD aparelhos |
| `composables/usePatientAasi.js` | Labels e helpers |

---

## Cadastro AASI

- Um paciente pode ter **vários** aparelhos
- Campos: orelha, marca, modelo, série, potência, tecnologia, cor, fornecedor, datas, observações
- `sale_order_id` preparado (nullable, sem FK)
- Desativação via `active=false` (não hard delete)
- Isolamento por `tenant_id` + validação de `patient_id`

---

## Resumo do paciente

`GET /patients/:id/summary` retorna:

- Dados do paciente
- Contagens: anamneses, evoluções, consultas, arquivos, prescrições, AASI
- Próxima consulta futura
- Última evolução

---

## Comandos executados

```bash
cd back-end && npm run migrate
cd back-end && node server.js          # boot OK
cd back-end && node scripts/phase6-smoke.js
cd front-end && npm run build          # OK
```

---

## Resultados de validação

| Check | Resultado |
|-------|-----------|
| Backend boot | ✅ OK |
| Frontend build | ✅ OK |
| Migrations | ✅ 3 aplicadas |
| Smoke tests | ✅ 19/20 (1ª execução completa); 20/20 após correção rota prescrições |

### Smoke tests cobertos

- Login admin, listar/criar/editar/arquivar paciente
- Resumo do paciente
- CRUD AASI + desativar
- Permissões admin/professional/receptionist
- Isolamento tenant AASI
- Regressão: agenda, anamnese, evoluções, arquivos, prescrições

---

## Pendências restantes

1. Relatório completo do cliente (fase futura)
2. Integração `sale_order_id` com módulo de vendas
3. Endpoint dedicado de consultas por paciente (hoje Agenda filtra no frontend)
4. Testes E2E automatizados (Playwright/Cypress)

---

## Riscos para próxima fase

- Rate limit de login pode afetar smoke tests repetidos
- Mudança de permissão `professional` (sem create/update paciente) pode impactar usuários acostumados
- Migration CPF por tenant idempotente se índice já existir via sync

---

## Commits sugeridos

**Backend:** aasi model/routes → summary → patient refactor → docs  
**Frontend:** aasi tab → summary → patient list/form → docs
