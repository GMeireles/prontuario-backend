'use strict';

const now = new Date();

const plans = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Plano gratuito para começar',
    price_cents: 0,
    currency: 'brl',
    interval: 'month',
    stripe_price_id: null,
    max_users: 1,
    max_patients: 30,
    max_storage_mb: 500,
    features: JSON.stringify(['dashboard', 'patients', 'appointments']),
    active: true,
    created_at: now,
    updated_at: now
  },
  {
    name: 'Basic',
    slug: 'basic',
    description: 'Para clínicas em crescimento',
    price_cents: 9900,
    currency: 'brl',
    interval: 'month',
    stripe_price_id: null,
    max_users: 3,
    max_patients: 300,
    max_storage_mb: 2000,
    features: JSON.stringify(['dashboard', 'patients', 'appointments', 'prescriptions']),
    active: true,
    created_at: now,
    updated_at: now
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Para clínicas com maior volume',
    price_cents: 19900,
    currency: 'brl',
    interval: 'month',
    stripe_price_id: null,
    max_users: 10,
    max_patients: 2000,
    max_storage_mb: 10000,
    features: JSON.stringify(['dashboard', 'patients', 'appointments', 'prescriptions', 'files']),
    active: true,
    created_at: now,
    updated_at: now
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Limites personalizados e suporte dedicado',
    price_cents: 0,
    currency: 'brl',
    interval: 'month',
    stripe_price_id: null,
    max_users: null,
    max_patients: null,
    max_storage_mb: null,
    features: JSON.stringify(['all']),
    active: true,
    created_at: now,
    updated_at: now
  }
];

export async function up(queryInterface) {
  const existing = await queryInterface.sequelize.query(
    'SELECT COUNT(*) AS count FROM plans',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );
  const count = Number(existing?.[0]?.count || 0);
  if (count > 0) return;

  await queryInterface.bulkInsert('plans', plans);

  const [freePlan] = await queryInterface.sequelize.query(
    "SELECT id FROM plans WHERE slug = 'free' LIMIT 1",
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );
  if (!freePlan?.id) return;

  const tenants = await queryInterface.sequelize.query(
    'SELECT id FROM tenants',
    { type: queryInterface.sequelize.QueryTypes.SELECT }
  );

  for (const tenant of tenants) {
    const [existingSub] = await queryInterface.sequelize.query(
      'SELECT id FROM subscriptions WHERE tenant_id = :tenantId LIMIT 1',
      {
        replacements: { tenantId: tenant.id },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    if (existingSub?.id) continue;

    await queryInterface.bulkInsert('subscriptions', [{
      tenant_id: tenant.id,
      plan_id: freePlan.id,
      status: 'active',
      created_at: now,
      updated_at: now
    }]);

    await queryInterface.sequelize.query(
      `UPDATE tenants SET plan_id = :planId, subscription_status = 'active', plan = 'free' WHERE id = :tenantId`,
      { replacements: { planId: freePlan.id, tenantId: tenant.id } }
    );
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('subscriptions', null, {});
  await queryInterface.bulkDelete('plans', null, {});
}
