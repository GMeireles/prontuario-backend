# PHASE_5_SAAS_STRIPE_REPORT.md

> Fase 5 — SaaS Base / Tenants / Planos / Stripe | Data: 2026-06-16

## Branches

| Repositório | Branch |
|-------------|--------|
| `back-end/` | `feature/prontuario-modernizacao` |
| `front-end/` | `feature/refactor-frontend-base` |

---

## Resumo

Implementada a base SaaS do Prontuário: planos no banco, assinatura por tenant, integração Stripe (checkout, portal, webhooks), middleware de bloqueio por status de assinatura, limites básicos de plano e telas frontend de billing/configurações. Migrations incrementais e não destrutivas; `users.tenant_id` e auth existentes preservados.

---

## Migrations criadas

| Arquivo | Tabela / alteração |
|---------|-------------------|
| `20260616000001-create-plans.js` | `plans` |
| `20260616000002-create-subscriptions.js` | `subscriptions` |
| `20260616000003-create-subscription-events.js` | `subscription_events` |
| `20260616000004-create-tenant-memberships.js` | `tenant_memberships` |
| `20260616000005-add-billing-fields-to-tenants.js` | `tenants`: `stripe_customer_id`, `subscription_status`, `plan_id`, `billing_email` |

Campo legado `tenants.plan` (ENUM) mantido.

---

## Models criados / atualizados

| Model | Observação |
|-------|------------|
| `Plan.js` | Novo |
| `Subscription.js` | Novo |
| `SubscriptionEvent.js` | Novo |
| `TenantMembership.js` | Novo (futuro N:N) |
| `Tenant.js` | Campos billing + associações (`currentPlan`, `subscription`, `memberships`) |

---

## Services criados

| Service | Responsabilidade |
|---------|------------------|
| `planService.js` | Listar/buscar planos |
| `subscriptionService.js` | Assinatura por tenant, `ensureForTenant`, sync Stripe |
| `stripeService.js` | Customer, checkout, portal, validação webhook |
| `billingService.js` | Orquestração billing API |
| `stripeWebhookService.js` | Processamento idempotente de eventos |
| `tenantAccessService.js` | Acesso por status + uso (users/patients) |
| `planLimitsService.js` | Limites de usuários e pacientes |

---

## Rotas criadas

| Método | Rota | Auth | Permissão |
|--------|------|------|-----------|
| GET | `/api/billing/plans` | Não | Pública |
| GET | `/api/billing/subscription` | Sim | `billing.view` |
| POST | `/api/billing/checkout` | Sim | `billing.manage` |
| POST | `/api/billing/portal` | Sim | `billing.manage` |
| POST | `/api/webhooks/stripe` | Assinatura Stripe | Pública (raw body) |

### Contrato billing

**GET /billing/plans**
```json
{ "success": true, "data": [{ "id", "name", "slug", "price_cents", "max_users", "max_patients", ... }] }
```

**GET /billing/subscription**
```json
{
  "success": true,
  "data": {
    "subscription": { "status", "plan": { ... }, ... },
    "usage": { "users", "patients", "storage_mb" }
  }
}
```

**POST /billing/checkout** — body: `{ "planId" }` ou `{ "planSlug" }`
```json
{ "success": true, "data": { "checkoutUrl", "sessionId" } }
```

**POST /billing/portal**
```json
{ "success": true, "data": { "portalUrl" } }
```

**402 (assinatura inativa)**
```json
{ "success": false, "message": "Assinatura inativa ou pagamento pendente." }
```

**403 (limite de plano)**
```json
{ "success": false, "message": "Limite do plano atingido." }
```

---

## Middleware `requireActiveSubscription`

- Permite: `trialing`, `active`
- Bloqueia: `past_due`, `unpaid`, `canceled`, `incomplete` → HTTP 402
- Aplicado em: `patients`, `records`, `appointments`, `anamneses`, `evolutions`, `prescriptions`, `files`
- **Não** aplicado em: login, refresh, `/auth/me`, `/billing/*`, webhook Stripe

---

## Eventos Stripe suportados

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Idempotência via `subscription_events.provider_event_id`.

---

## Variáveis de ambiente

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUCCESS_URL=http://localhost:6263/app/billing?success=1
STRIPE_CANCEL_URL=http://localhost:6263/app/billing?canceled=1
STRIPE_CUSTOMER_PORTAL_RETURN_URL=http://localhost:6263/app/billing
```

Documentadas em `back-end/src/.env.example`. Sem chaves reais no código.

---

## Seeder

`20260616000001-saas-plans.js` — planos Free, Basic, Pro, Enterprise + assinatura `active` free para tenants existentes (idempotente).

---

## Frontend

| Item | Detalhe |
|------|---------|
| Rotas | `/app/billing`, `/app/settings` |
| API | `src/api/billing.js` |
| Store | `src/stores/billingStore.js` |
| Telas | `BillingView.vue`, `SettingsView.vue` |
| Banner | `SubscriptionBanner.vue` (past_due, unpaid, canceled, incomplete) |
| Interceptor 402 | Redireciona para `/app/billing` sem deslogar |
| Menu | Billing/settings apenas admin (`billing.view`) |

---

## Permissões billing

| Permissão | Admin | Professional | Receptionist |
|-----------|-------|--------------|--------------|
| `billing.view` | ✅ | ❌ | ❌ |
| `billing.manage` | ✅ | ❌ | ❌ |

---

## Limites de plano

| Recurso | Service | Status |
|---------|---------|--------|
| Usuários | `planLimitsService.assertCanCreateUser` | ✅ em `authService.register` |
| Pacientes | `planLimitsService.assertCanCreatePatient` | ✅ em `patientService.create` |
| Storage R2 | Estrutura `max_storage_mb` | Preparado, não enforced |

---

## Comandos executados

```bash
cd back-end && npm install stripe
cd back-end && npm run migrate
cd back-end && npx sequelize-cli db:seed --seed 20260616000001-saas-plans.js
cd back-end && node server.js          # boot OK porta 4001
cd front-end && npm run build          # OK
cd back-end && node scripts/phase5-smoke.js
```

---

## Resultados de validação

| Check | Resultado |
|-------|-----------|
| Backend boot | ✅ OK |
| Frontend build | ✅ OK (Vite 7, 143 módulos) |
| Migrations | ✅ 5 aplicadas |
| Seeder planos | ✅ 4 planos + subscriptions tenants |
| Smoke tests | ✅ 13/14 na 1ª execução completa; 14/14 após correção de payload paciente |

### Smoke tests cobertos

- Login admin + `/auth/me`
- Listar planos públicos
- Ver assinatura atual (admin)
- Billing bloqueado para professional/receptionist
- Checkout sem `stripe_price_id` → erro amigável
- Portal sem `stripe_customer_id` → erro amigável
- Webhook assinatura inválida → 400
- Rotas clínicas com `active` → OK
- Rotas clínicas com `past_due` → 402
- Billing acessível com `past_due`
- Criar paciente dentro do limite

---

## Pendências restantes

1. Configurar `stripe_price_id` reais nos planos pagos quando conta Stripe estiver pronta
2. Teste E2E checkout/portal com credenciais Stripe reais
3. Enforcement de `max_storage_mb` (R2) — próxima fase
4. `tenant_memberships` — uso real em auth multi-clínica (futuro)
5. Tela master de gestão de planos (opcional; Marcenaria tem admin CRUD)

---

## Riscos para próxima fase

- Rate limit de login pode afetar testes automatizados repetidos
- Tenants sem seeder em ambientes novos precisam rodar migration + seed de planos antes do boot
- Campo legado `tenants.plan` vs FK `plan_id` — manter sincronizados via `subscriptionService`

---

## Commits sugeridos (aplicados nesta fase)

**Backend:** models/migrations → stripe services/routes → middleware → limits → docs  
**Frontend:** billing screens → 402 handling → docs
