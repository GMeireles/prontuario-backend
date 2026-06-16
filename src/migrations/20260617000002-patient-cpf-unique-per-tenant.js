'use strict';

export async function up(queryInterface, Sequelize) {
  const duplicates = await queryInterface.sequelize.query(
    `SELECT tenant_id, cpf, COUNT(*) AS cnt
     FROM patients
     GROUP BY tenant_id, cpf
     HAVING cnt > 1
     LIMIT 1`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (duplicates.length > 0) {
    const d = duplicates[0];
    throw new Error(
      `Migration abortada: CPF duplicado no tenant ${d.tenant_id} (cpf=${d.cpf}). Resolva manualmente antes de continuar.`
    );
  }

  try {
    await queryInterface.removeIndex('patients', 'cpf');
  } catch {
    try {
      await queryInterface.removeIndex('patients', ['cpf']);
    } catch {
      /* index name may vary */
    }
  }

  const indexes = await queryInterface.showIndex('patients');
  const hasComposite = indexes.some((idx) => idx.name === 'patients_tenant_id_cpf_unique');
  if (!hasComposite) {
    await queryInterface.addIndex('patients', ['tenant_id', 'cpf'], {
      unique: true,
      name: 'patients_tenant_id_cpf_unique'
    });
  }
}

export async function down(queryInterface) {
  await queryInterface.removeIndex('patients', 'patients_tenant_id_cpf_unique');
  await queryInterface.addIndex('patients', ['cpf'], {
    unique: true,
    name: 'cpf'
  });
}
