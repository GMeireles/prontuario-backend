import express from 'express';
import {
  createAnamnese,
  listAnamneses,
  updateAnamnese,
  deleteAnamnese,
  getAnamneseByPatient
} from '../controllers/anamneseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { anamneseCreateValidation, anamneseUpdateValidation } from '../validators/anamneseValidation.js';

const router = express.Router();

router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESES_CREATE),
  anamneseCreateValidation,
  validate,
  createAnamnese
);

router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESES_VIEW),
  getAnamneseByPatient
);

router.get(
  '/all/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESES_VIEW),
  listAnamneses
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESES_UPDATE),
  anamneseUpdateValidation,
  validate,
  updateAnamnese
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESES_UPDATE),
  deleteAnamnese
);

export default router;
