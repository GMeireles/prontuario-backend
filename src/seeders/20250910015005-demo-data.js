'use strict';

import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const passwordHash = await bcrypt.hash('abcd@1234', 10);

  // Usuários
  await queryInterface.bulkInsert('users', [
    {
      name: 'Admin',
      email: 'guilherme.meireles@vexial.com.br',
      password_hash: passwordHash,
      role: 'admin',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Vanessa',
      email: 'vanessa@vexial.com.br',
      password_hash: passwordHash,
      role: 'professional',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('appointments', null, {});
  await queryInterface.bulkDelete('records', null, {});
  await queryInterface.bulkDelete('patients', null, {});
  await queryInterface.bulkDelete('users', null, {});
}
