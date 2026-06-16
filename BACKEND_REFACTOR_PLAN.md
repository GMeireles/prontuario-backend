# BACKEND_REFACTOR_PLAN.md

> Fase 2 — Refatoração Backend Base | Branch: `feature/prontuario-modernizacao`  
> Referência: ARCHITECTURE_GUIDE.md §2, MIGRATION_PLAN.md Fase 0/1

## Arquitetura atual

- Entry monolítico: `src/index.js` (Express + sync + listen)
- Rotas montadas ad-hoc sem `routes/index.js`
- `middlewares/` + `validations/` (guia: `middleware/` + `validators/`)
- Controllers com lógica inline; `services/` vazio
- Tenant via `tenantMiddleware` manual; sem plugin Sequelize
- Bugs: jwt.sign, uuid, logs JWT, fs/path, rotas duplicadas, tenant leaks

## Arquitetura alvo

```
back-end/
├── server.js
├── .sequelizerc
├── package.json
└── src/
    ├── app.js
    ├── config/
    ├── middleware/
    ├── validators/
    ├── routes/index.js
    ├── controllers/
    ├── services/
    ├── models/
    ├── utils/
    └── migrations/
```

Pipeline tenant: `authMiddleware → tenantContextMiddleware → roleMiddleware → controller`

## Módulos refatorados

| Módulo | Ação |
|--------|------|
| Entry | `server.js` + `app.js` |
| Auth | `utils/jwt.js`, `services/authService.js` |
| Tenant | `middleware/tenantContext.js`, `utils/sequelizeTenantPlugin.js` |
| Domínio clínico | services + controllers finos |
| Models | FKs completas + `addTenantScope` |
| Erros | `utils/errorHandler.js` + middleware global |

## Não alterar nesta fase

- Schema DB (sem DROP/ALTER/migrations novas)
- Endpoints e formatos de resposta do frontend
- Stripe, TenantMembership, R2
- `{ accessToken, refreshToken }` no login

## Ordem de execução

1. Fase A — Bugs runtime
2. Fase B — server.js + app.js
3. Fase C — utils (jwt, errorHandler, tenant plugin)
4. Fase D — tenantContext + routes/index.js
5. Fase E-F — validators rename, services, models
6. Fase G-H — smoke tests + BACKEND_REFACTOR_REPORT.md

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Quebrar frontend | Preservar paths e response shapes |
| Plugin tenant em /tenants | Tenant model fora do scope |
| sync() em prod | Condicional NODE_ENV |
