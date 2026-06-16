# INTEGRATION_AUDIT_REPORT.md

> Fase 3 — Auditoria geral frontend + backend | Data: 2026-06-16

## Branch usada

| Repositório | Branch |
|-------------|--------|
| `back-end/` | `feature/prontuario-modernizacao` |
| `front-end/` | `feature/refactor-frontend-base` |

> O frontend não possui `feature/prontuario-modernizacao`; a branch de modernização ativa é `feature/refactor-frontend-base` (mesmo escopo da Fase 2).

---

## Resumo da auditoria

Auditoria cruzada de **45 arquivos frontend** (`api/`, `stores/`, `views/`, `components/prontuario/`) contra **12 routers backend** montados em `/api`. Build frontend OK. Backend inicia e responde. Principais gaps eram: permissões admin em anamnese/evolução, `professional_id` ignorado na criação de consultas, tipos de arquivo incompatíveis com ENUM MySQL, refresh token não utilizado no interceptor HTTP, e campos `created_at` vs `createdAt`.

---

## Problemas encontrados — Frontend

| # | Problema | Severidade | Status |
|---|----------|------------|--------|
| F1 | Interceptor HTTP fazia logout imediato em 401 sem tentar refresh | Alta | Corrigido |
| F2 | `ArquivosTab` usava tipos (`atestado`, `raiox`…) fora do ENUM do banco | Alta | Corrigido |
| F3 | Datas exibidas com `createdAt` mas API retorna `created_at` | Média | Corrigido |
| F4 | `listFilesByPatient` não desembrulhava `{ success, data }` de forma consistente | Média | Corrigido |
| F5 | `authStore` não buscava `/auth/me` após login (nome ausente na UI) | Média | Corrigido |
| F6 | `PrescricoesTab` sem fallback para `prescription_files` undefined | Baixa | Corrigido |

---

## Problemas encontrados — Backend

| # | Problema | Severidade | Status |
|---|----------|------------|--------|
| B1 | `POST /anamneses` e `POST /evolutions` bloqueavam role `admin` (403) | Alta | Corrigido |
| B2 | `appointmentService.create` ignorava `professional_id` do formulário | Alta | Corrigido |
| B3 | `GET /appointments` não incluía associação `professional` | Média | Corrigido |
| B4 | Upload com `type=prescription` violava ENUM `files.type` | Alta | Corrigido (normalização) |
| B5 | `/auth/me` e JWT sem campo `name` | Média | Corrigido |
| B6 | Rota `GET /files/:id/download` declarada após `/:patientId` (risco de roteamento) | Baixa | Corrigido (reordenado) |
| B7 | `.env.example` desatualizado / com placeholder inseguro | Baixa | Corrigido |

---

## Problemas encontrados — Integração

| # | Problema | Correção |
|---|----------|----------|
| I1 | Admin não conseguia salvar anamnese/evolução no prontuário | Roles `admin` adicionados nas rotas |
| I2 | Agenda mostrava profissional vazio na listagem | Include `professional` no `list()` |
| I3 | Seleção de profissional na consulta ignorada | `professional_id` do body respeitado |
| I4 | Anexo de prescrição com `type=prescription` falharia no MySQL | Mapeado para `document` no `fileService` |
| I5 | Token expirado deslogava sem refresh silencioso | Interceptor tenta `authStore.refresh()` antes de logout |

### Matriz endpoint ↔ frontend (validada)

| Frontend API | Backend | Método | Contrato |
|--------------|---------|--------|----------|
| `auth.js` login/refresh/logout/me | `/api/auth/*` | POST/GET | OK |
| `patients.js` | `/api/patients` | CRUD + `/recent` | OK (array direto) |
| `appointments.js` | `/api/appointments` | CRUD + `/today` | OK |
| `anamneses.js` | `/api/anamneses/patient/:id` | GET/POST/PUT/DELETE | OK |
| `evolutions.js` | `/api/evolutions/patient/:id` | GET/POST/PUT/DELETE | OK (`{success,data}`) |
| `prescriptions.js` | `/api/prescriptions` | CRUD + files | OK |
| `files.js` | `/api/files` | upload/list/download/delete | OK |
| `tenants.js` | `/api/tenants` | CRUD | OK (`{success,data}` normalizado) |
| `users.js` | `/api/users` | GET | OK |

**Não utilizado pelo frontend:** `/api/records` (legado; removido na refatoração frontend — documentado, sem impacto).

---

## Correções realizadas

### Backend (`feature/prontuario-modernizacao`)
- `authMiddleware.js`, `utils/jwt.js` — incluir `name` no usuário/JWT
- `appointmentService.js` — include professional + respeitar `professional_id`
- `fileService.js` — normalizar tipos de arquivo para ENUM válido
- `routes/fileRoutes.js` — download antes de listagem por paciente
- `routes/anamneseRoutes.js`, `evolutionRoutes.js` — admin permitido
- `src/.env.example` — variáveis documentadas

### Frontend (`feature/refactor-frontend-base`)
- `api/http.js` — refresh token em 401
- `api/files.js` — helper `unwrapData`
- `stores/auth.js` — `fetchUser()` via `/auth/me` após login/init
- `ArquivosTab.vue` — tipos ENUM + `created_at`
- `PrescricoesTab.vue` — datas e pagination fallback

---

## Fluxos testados (manual / curl)

| Fluxo | Resultado |
|-------|-----------|
| Login | 200 — `{ accessToken, refreshToken }` |
| Refresh token | 200 — `{ accessToken }` |
| GET /auth/me | 200 — inclui `name` |
| Listar pacientes | 200 — array |
| Pacientes recentes | 200 — array |
| Consultas hoje | 200 — array |
| Listar consultas (com professional) | 200 — `professional.name` presente |
| Criar consulta com professional_id=2 | 201 — `professional_id: 2` |
| Criar anamnese (admin) | 201 |
| Criar evolução (admin) | 201 |
| Listar prescrições | 200 — `{ success, data, pagination }` |
| Listar arquivos paciente | 200 — `{ success, data }` |
| Listar tenants (admin) | 200 |
| Listar profissionais | 200 |

### Fluxos documentados (teste manual recomendado na UI)

- [ ] Logout
- [ ] Dashboard (atalhos + agenda hoje)
- [ ] CRUD paciente via modal
- [ ] Abrir prontuário → abas anamnese/evoluções/prescrições/arquivos
- [ ] Upload arquivo na aba Arquivos
- [ ] Upload anexo em prescrição
- [ ] Download arquivo
- [ ] Master → clínicas (TenantsView)

---

## Comandos executados

```bash
# Backend
cd back-end && npm install
node server.js

# Frontend
cd front-end && npm run build

# Smoke API (curl) — ver seção fluxos testados
```

---

## Resultado do build

| Projeto | Comando | Resultado |
|---------|---------|-----------|
| Frontend | `npm run build` | **OK** — 136 módulos, exit 0, ~2.3s |
| Backend | `npm start` / `node server.js` | **OK** — porta 4001 |
| Frontend lint | `npm run lint` | Não configurado |
| Frontend test | `npm test` | Não configurado |
| Backend build | N/A | Node ESM, sem step de build |
| Backend lint/test | N/A | Não configurado |

---

## Pendências restantes (não corrigidas — risco ou escopo)

| Item | Motivo |
|------|--------|
| `POST /auth/register` sem `tenant_id` no validator | Endpoint admin interno; frontend não usa; requer decisão de produto |
| Respostas mistas (array vs `{success,data}`) | Preservado para não quebrar frontend; unificar na Fase 4 |
| `TenantMembership` / multi-tenant real | Fase SaaS |
| Stripe / `requireActiveSubscription` | Stub apenas |
| Upload R2 | Disco local mantido |
| `/api/records` | Sem consumidor no frontend refatorado |
| Testes automatizados E2E | Não existiam; criar na próxima fase |
| Unificar branch frontend para `feature/prontuario-modernizacao` | Opcional; renomear/merge quando conveniente |

---

## Riscos para próxima fase

1. **Tenant plugin** pode bloquear queries admin cross-tenant — usar `withoutTenantScope()` quando necessário.
2. **ENUM `files.type`** limita categorias da UI — expandir requer migration (fora do escopo atual).
3. **JWT 15min** — refresh depende de `refreshToken` no localStorage; testar expiração em sessões longas na UI.
4. **Dois repositórios Git** — deploy deve versionar back e front em conjunto.

---

## Recomendação — próxima fase

1. **Fase 5 SaaS:** TenantMembership, Stripe, `/auth/my-tenants`
2. **Prontuário avançado** + anamnese flexível
3. **Qualidade:** Playwright ou Cypress para fluxos críticos
4. Permissões em banco (se escalar além de código)

> Fase 4 concluída — ver [`PHASE_4_API_PERMISSIONS_REPORT.md`](PHASE_4_API_PERMISSIONS_REPORT.md)

---

## Arquivos alterados nesta fase

### Backend
- `src/middleware/authMiddleware.js`
- `src/utils/jwt.js`
- `src/services/appointmentService.js`
- `src/services/fileService.js`
- `src/routes/fileRoutes.js`
- `src/routes/anamneseRoutes.js`
- `src/routes/evolutionRoutes.js`
- `src/.env.example`

### Frontend
- `src/api/http.js`
- `src/api/files.js`
- `src/stores/auth.js`
- `src/components/prontuario/ArquivosTab.vue`
- `src/components/prontuario/PrescricoesTab.vue`
