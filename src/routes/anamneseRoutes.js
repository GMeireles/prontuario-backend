// routes/anamneseRoutes.js
import express from 'express';
import {
  createAnamnese,
  listAnamneses,
  updateAnamnese,
  deleteAnamnese,
  getAnamneseByPatient
} from '../controllers/anamneseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { validate } from '../middleware/validate.js';
import {
  anamneseCreateValidation,
  anamneseUpdateValidation
} from '../validators/anamneseValidation.js';

const router = express.Router();

// Criar anamnese para um paciente
router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  anamneseCreateValidation,
  validate,
  createAnamnese
);

// Buscar a anamnese única de um paciente
router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  getAnamneseByPatient
);

// Listar todas as anamneses de um paciente (se for manter histórico)
router.get(
  '/all/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listAnamneses
);

// Atualizar
router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  anamneseUpdateValidation,
  validate,
  updateAnamnese
);

// Excluir
router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  deleteAnamnese
);

export default router;
