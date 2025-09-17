'use strict';

import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const passwordHash = await bcrypt.hash('Chigol@!2003', 10);

  // Usuários
  await queryInterface.bulkInsert('users', [
    {
      name: 'Admin',
      email: 'admin@apaepm.org.br',
      password_hash: passwordHash,
      role: 'admin',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Administrador 2',
      email: 'admin2@apaepm.org.br',
      password_hash: passwordHash,
      role: 'admin',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Profissional Teste',
      email: 'profissional@apaepm.org.br',
      password_hash: passwordHash,
      role: 'professional',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Assistente Teste',
      email: 'assistente@apaepm.org.br',
      password_hash: passwordHash,
      role: 'assistant',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});

  // Buscar o ID do profissional para usar nas consultas
  const professionals = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE role='professional' LIMIT 1;`
  );
  const professionalId = professionals[0][0].id;

  // Pacientes
  await queryInterface.bulkInsert('patients', [
    {
      name: 'Paciente Teste',
      cpf: '12345678901',
      birth_date: '1990-01-01',
      gender: 'M',
      phone: '(11) 99999-9999',
      email: 'paciente@example.com',
      address: 'Rua A, 123',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01000-000',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Maria Oliveira',
      cpf: '23456789012',
      birth_date: '2015-05-10',
      gender: 'F',
      phone: '(31) 98888-1111',
      email: 'maria@example.com',
      address: 'Rua B, 456',
      city: 'Belo Horizonte',
      state: 'MG',
      zip_code: '30100-000',
      responsible_name: 'Ana Oliveira',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Carlos Souza',
      cpf: '34567890123',
      birth_date: '1985-03-22',
      gender: 'M',
      phone: '(21) 97777-2222',
      email: 'carlos@example.com',
      address: 'Av. Central, 789',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip_code: '20000-000',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});

  // Buscar IDs dos pacientes
  const patients = await queryInterface.sequelize.query(
    `SELECT id, name FROM patients WHERE email IN ('paciente@example.com','maria@example.com','carlos@example.com');`
  );

  const pacienteTeste = patients[0].find(p => p.name === 'Paciente Teste');
  const maria = patients[0].find(p => p.name === 'Maria Oliveira');
  const carlos = patients[0].find(p => p.name === 'Carlos Souza');

  // Registros clínicos
  await queryInterface.bulkInsert('records', [
    {
      patient_id: pacienteTeste.id,
      description: 'Primeira consulta realizada com sucesso',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      patient_id: maria.id,
      description: 'Paciente apresenta dificuldades de fala',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      patient_id: carlos.id,
      description: 'Exame de rotina sem alterações',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});

  // Consultas
  await queryInterface.bulkInsert('appointments', [
    {
      patient_id: pacienteTeste.id,
      professional_id: professionalId,
      date_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
      notes: 'Retorno agendado',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      patient_id: maria.id,
      professional_id: professionalId,
      date_time: new Date(Date.now() + 48 * 60 * 60 * 1000),
      notes: 'Avaliação inicial de fonoaudiologia',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      patient_id: carlos.id,
      professional_id: professionalId,
      date_time: new Date(Date.now() + 72 * 60 * 60 * 1000),
      notes: 'Exame de acompanhamento',
      tenant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('appointments', null, {});
  await queryInterface.bulkDelete('records', null, {});
  await queryInterface.bulkDelete('patients', null, {});
  await queryInterface.bulkDelete('users', null, {});
}
