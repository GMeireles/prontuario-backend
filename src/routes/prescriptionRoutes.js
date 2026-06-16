import express from 'express';
import { createPrescription, listPrescriptions, updatePrescription, deletePrescription } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { prescriptionCreateValidation, prescriptionUpdateValidation } from '../validators/prescriptionValidation.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_CREATE),
  prescriptionCreateValidation,
  validate,
  createPrescription
);

router.get(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_VIEW),
  listPrescriptions
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_UPDATE),
  prescriptionUpdateValidation,
  validate,
  updatePrescription
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_UPDATE),
  deletePrescription
);

export default router;
