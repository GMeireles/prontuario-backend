'use strict';

import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Usuário Admin
  await queryInterface.bulkInsert('users', [{
    name: 'Admin',
    email: 'admin@example.com',
    password_hash: passwordHash,
    role: 'admin',
    tenant_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }], {});

  // Paciente de Teste
  await queryInterface.bulkInsert('patients', [{
    name: 'Paciente Teste',
    birth_date: '1990-01-01',
    phone: '(11) 99999-9999',
    email: 'paciente@example.com',
    tenant_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }], {});

  // Pegar o paciente inserido
  const patients = await queryInterface.sequelize.query(
    `SELECT id FROM patients WHERE email='paciente@example.com';`
  );
  const patientId = patients[0][0].id;

  // Registro Clínico
  await queryInterface.bulkInsert('records', [{
    patient_id: patientId,
    description: 'Primeira consulta realizada com sucesso',
    tenant_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }], {});

  // Consulta
  await queryInterface.bulkInsert('appointments', [{
    patient_id: patientId,
    date_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
    notes: 'Retorno agendado',
    tenant_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('appointments', null, {});
  await queryInterface.bulkDelete('records', null, {});
  await queryInterface.bulkDelete('patients', null, {});
  await queryInterface.bulkDelete('users', null, {});
}
