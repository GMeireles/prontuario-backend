# BACKEND_REFACTOR_REPORT.md

> Branch: `feature/prontuario-modernizacao` | Fase 2 concluída

## Resumo

Refatoração do backend Prontuário para o padrão Marcenaria (ARCHITECTURE_GUIDE §2), preservando banco, endpoints e contratos do frontend refatorado.

## Estrutura final

```
back-end/
├── server.js                 # Entry: listen + sync condicional
├── package.json              # Scripts npm (start, dev, migrate, seed)
├── .sequelizerc
├── BACKEND_REFACTOR_PLAN.md
├── BACKEND_REFACTOR_REPORT.md
└── src/
    ├── app.js                # Express + helmet + cors + routes
    ├── config/cli-config.cjs
    ├── middleware/           # auth, tenantContext, role, validate, errors
    ├── validators/           # express-validator (ex validations/)
    ├── routes/index.js       # Mount centralizado /api/*
    ├── controllers/          # Finos — delegam a services
    ├── services/             # Lógica de domínio
    ├── utils/                # jwt, errorHandler, tenantStore, tenant plugin
    └── models/               # FKs completas + addTenantScope
```

## Padrões Marcenaria aplicados

| Padrão | Implementação |
|--------|---------------|
| Entry split | `server.js` + `app.js` |
| Helmet | `app.js` |
| sync condicional | Somente `NODE_ENV !== 'production'` |
| `middleware/` + `validators/` | Renomeado de middlewares/validations |
| `routes/index.js` | Mount único em `/api` |
| Services layer | 10 services criados |
| JWT utils | `utils/jwt.js` — sem console.log, secret obrigatório |
| Tenant plugin | `sequelizeTenantPlugin` + `tenantStore` (AsyncLocalStorage) |
| tenantContext | Header `X-Tenant-ID` validado contra JWT |
| requireActiveSubscription | Stub (sempre `next()`) |

## Bugs corrigidos (Fase A)

- `jwt.sign` com `console.log` inválido → `signAccessToken` em `utils/jwt.js`
- Refresh token usa `crypto.randomUUID()` (sem dep `uuid`)
- Logs de `JWT_SECRET` removidos
- `fs`/`path` em delete de arquivo via `fileService`
- Rotas duplicadas em `appointmentRoutes.js` consolidadas
- `/patients/recent` recebe `tenantContextMiddleware`
- `body('tenant_id')` removido de validators
- Código morto removido: `config/db.js`, `middlewares/upload.js`, pasta `middlewares/`

## Endpoints preservados

Todos os paths em `/api/*` mantidos: auth, patients, records, appointments, anamneses, evolutions, prescriptions, files, tenants, users.

### Contratos críticos (frontend)

| Endpoint | Resposta |
|----------|----------|
| `POST /api/auth/login` | `{ accessToken, refreshToken }` |
| `POST /api/auth/refresh` | `{ accessToken }` |
| `GET /api/patients` | array direto |
| `GET /api/patients/recent` | array direto |
| `GET /api/evolutions/patient/:id` | `{ success, data }` |
| `GET /api/prescriptions/:patientId` | `{ success, data, pagination }` |
| `GET /api/files/:patientId` | `{ success, data }` |
| `GET /api/tenants` | `{ success, data }` |

## Auth e tenant

- `authMiddleware`: JWT via `verifyToken`, recarrega user do DB
- `tenantContextMiddleware`: resolve tenant de `X-Tenant-ID` ou JWT; valida match
- Models com scope: Patient, Appointment, Anamnese, Evolution, Prescription, File, Record
- Tenant/User/RefreshToken **fora** do scope (admin e auth)

## Comandos

```bash
cd back-end && npm install
npm run dev          # nodemon server.js
npm start            # node server.js
npm run migrate      # sequelize-cli
npm run seed
```

## Smoke tests (2026-06-16)

| Teste | Resultado |
|-------|-----------|
| `POST /api/auth/login` | 200 — `{ accessToken, refreshToken }` |
| `POST /api/auth/refresh` | 200 — `{ accessToken }` |
| `GET /api/patients` + Bearer + X-Tenant-ID | 200 — array |
| `GET /api/appointments/today` | 200 — array |

Credenciais demo: `guilherme.meireles@vexial.com.br` / `abcd@1234`

## Pendências (próxima fase)

- TenantMembership + `/auth/my-tenants`
- Stripe + `requireActiveSubscription` real
- Respostas uniformes `{ data, meta }`
- Upload R2
- Permissões granulares além de `role`
- `npm test` / lint (não existiam antes)

## Riscos próxima fase

- Plugin tenant pode conflitar com queries cross-tenant admin — usar `withoutTenantScope()`
- Migrar `package.json` de `src/` para root completamente (hoje coexistem)
