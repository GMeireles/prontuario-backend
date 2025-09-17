// routes/anamneseRoutes.js
import express from 'express';
import {
  createAnamnese,
  listAnamneses,
  updateAnamnese,
  deleteAnamnese,
  getAnamneseByPatient
} from '../controllers/anamneseController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  anamneseCreateValidation,
  anamneseUpdateValidation
} from '../validations/anamneseValidation.js';

const router = express.Router();

// Criar anamnese para um paciente
router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  anamneseCreateValidation,
  validate,
  createAnamnese
);

// Buscar a anamnese única de um paciente
router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['admin', 'professional']),
  getAnamneseByPatient
);

// Listar todas as anamneses de um paciente (se for manter histórico)
router.get(
  '/all/:patientId',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['admin', 'professional']),
  listAnamneses
);

// Atualizar
router.put(
  '/:id',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  anamneseUpdateValidation,
  validate,
  updateAnamnese
);

// Excluir
router.delete(
  '/:id',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  deleteAnamnese
);

export default router;
