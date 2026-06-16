# PHASE_4_API_PERMISSIONS_REPORT.md

> Fase 4 — Padronização de contrato API + permissões base | Data: 2026-06-16

## Branches

| Repositório | Branch |
|-------------|--------|
| `back-end/` | `feature/prontuario-modernizacao` |
| `front-end/` | `feature/refactor-frontend-base` |

---

## Resumo

Padronização do contrato de respostas da API em todos os controllers principais e implementação de permissões base por perfil (`admin`, `professional`, `assistant`→receptionist) em código, sem novas tabelas no banco. Frontend atualizado para consumir `{ success, data }` via helper centralizado e UI condicionada por `can()`.

---

## Padrão final de resposta da API

### Sucesso com dado
```json
{ "success": true, "data": ... }
```

### Sucesso com mensagem
```json
{ "success": true, "message": "...", "data": ... }
```

### Erro
```json
{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }
```

### Listagem paginada
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

### Auth (dentro de `data`)
- `POST /auth/login` → `{ success, data: { accessToken, refreshToken } }`
- `POST /auth/refresh` → `{ success, data: { accessToken } }`
- `GET /auth/me` → `{ success, data: { id, name, email, role, profile, tenant_id, permissions[] } }`

---

## Helpers criados

### Backend (`src/utils/apiResponse.js`)
- `successResponse(res, data, options?)`
- `errorResponse(res, message, errors?, status?)`
- `paginatedResponse(res, data, pagination, options?)`
- `noContentResponse(res)`

### Backend (`src/config/permissions.js`)
- `PERMISSIONS` — constantes
- `getPermissionsForRole(role)`
- `hasPermission(role, permission)`
- `getProfileLabel(role)` — `assistant` → `receptionist`

### Backend (`src/middleware/permissionMiddleware.js`)
- `requireAuth`
- `requirePermission(...permissions)`
- `requireRole(...roles)`

### Frontend (`src/api/response.js`)
- `parseApiResponse(payload)`
- `unwrapData(payload)`
- `unwrapList(payload)`

### Frontend (`src/composables/usePermissions.js`)
- `can(permission)`, `role`, `profile`, `permissions`

---

## Endpoints ajustados

Todos os controllers em: auth, users, patients, appointments, anamneses, evolutions, records, prescriptions, prescription_files, files, tenants.

Rotas protegidas com `requirePermission` (substituindo `roleMiddleware` na maioria dos domínios clínicos).

**Novo:** `GET /api/users/professionals` — lista profissionais para agenda (`appointments.create`), sem exigir `users.view`.

---

## Mudanças no frontend

| Arquivo | Mudança |
|---------|---------|
| `api/*.js` | Consumo via `unwrapData` / `unwrapList` / `parseApiResponse` |
| `stores/auth.js` | `permissions`, `can()`, `fetchUser()` com `/auth/me` |
| `stores/tenant.js` | `can()` delega ao auth store |
| `composables/usePermissions.js` | Helper reutilizável |
| Views/tabs prontuário | Botões condicionados por permissão |
| `PacientesView`, `ConsultasView` | CRUD condicionado |
| `ProntuarioView` | Abas filtradas por permissão |

---

## Perfis implementados

| Role (DB) | Profile (API) | Escopo |
|-----------|---------------|--------|
| `admin` | `admin` | Acesso total |
| `professional` | `professional` | Clínico + agenda + arquivos + prescrições |
| `assistant` | `receptionist` | Pacientes + agenda + visualizar arquivos (sem clínico) |

---

## Permissões por perfil

**Admin:** todas (`dashboard.view` … `prescriptions.update`)

**Professional:** pacientes (view/create/update), agenda, anamnese, evoluções, arquivos, prescrições — sem `users.*` nem `patients.delete`

**Receptionist (assistant):** pacientes (view/create/update), agenda, `files.view` + `files.download` — sem anamnese/evoluções/prescrições/upload

---

## Rotas protegidas (exemplos)

| Rota | Permissão |
|------|-----------|
| `GET /patients` | `patients.view` |
| `POST /patients` | `patients.create` |
| `DELETE /patients/:id` | `patients.delete` |
| `POST /anamneses/patient/:id` | `anamneses.create` |
| `POST /evolutions/patient/:id` | `evolutions.create` |
| `POST /prescriptions` | `prescriptions.create` |
| `POST /files` | `files.upload` |
| `GET /users` | `users.view` |
| `GET /users/professionals` | `appointments.create` |

---

## Menus/botões protegidos (frontend)

- Pacientes: criar/editar/excluir conforme `patients.*`
- Consultas: criar/editar/excluir conforme `appointments.*`
- Prontuário: abas filtradas; anamnese/evoluções/prescrições/arquivos com botões por permissão
- Receptionist: sem botões de anamnese, evolução, prescrição ou upload

---

## Pendências da Fase 3 corrigidas

| Item | Status |
|------|--------|
| `POST /auth/register` sem `tenant_id` | Corrigido — validator restaurado |
| `/api/records` sem frontend | Documentado — endpoint padronizado; sem UI nesta fase (legado) |

---

## Pendências restantes

- Stripe, TenantMembership, R2
- Tabela `role_permissions` no banco (permissões em código nesta fase)
- UI para `/api/records`
- Testes E2E automatizados
- Unificar branches frontend para `feature/prontuario-modernizacao` (opcional)

---

## Riscos

1. Contrato quebrado para clientes externos que esperavam array direto — frontend já migrado
2. `assistant` no ENUM do banco vs `receptionist` no produto — mapeado em `profile`
3. Permissões em código exigem deploy coordenado back+front

---

## Comandos executados

```bash
cd back-end && node server.js
cd front-end && npm run build
# Smoke tests Python/curl — 13/13 PASS
```

---

## Resultados

| Validação | Resultado |
|-----------|-----------|
| Backend boot | OK — porta 4001 |
| Frontend build | OK — exit 0, ~2.2s |
| Smoke tests | **13/13 PASS** |
| Lint/test | Não configurado |

### Smoke tests

| Teste | Resultado |
|-------|-----------|
| Login admin (`{success,data}`) | PASS |
| Refresh token | PASS |
| `/auth/me` com permissions | PASS |
| Listar pacientes | PASS |
| Anamnese admin/professional | PASS |
| Evolução professional | PASS |
| Anamnese receptionist bloqueada (403) | PASS |
| Evolução receptionist bloqueada (403) | PASS |
| Receptionist: pacientes + agenda | PASS |
| Prescrições paginadas | PASS |
| Arquivos list | PASS |

### Credenciais demo

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | guilherme.meireles@vexial.com.br | abcd@1234 |
| Professional | vanessa@vexial.com.br | abcd@1234 |
| Receptionist | recepcao@vexial.com.br | abcd@1234 |

---

## Recomendação — Fase 5

1. SaaS: TenantMembership, Stripe, `/auth/my-tenants`
2. Prontuário avançado + anamnese flexível
3. Permissões em banco (se necessário escalar)
4. Testes E2E Playwright
