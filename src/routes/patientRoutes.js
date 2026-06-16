import express from 'express';
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  listRecentPatients,
  getPatient,
  getPatientSummary
} from '../controllers/patientController.js';
import patientAasiRoutes from './patientAasiRoutes.js';
import { listPatientSignatures } from '../controllers/signatureController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { patientCreateValidation, patientUpdateValidation } from '../validators/patientValidation.js';

const router = express.Router();

const stack = [authMiddleware, tenantContextMiddleware, requireActiveSubscription];

router.get(
  '/',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_VIEW),
  listPatients
);

router.get(
  '/recent',
  ...stack,
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  listRecentPatients
);

router.post(
  '/',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_CREATE),
  patientCreateValidation,
  validate,
  createPatient
);

router.get(
  '/:id/summary',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_VIEW),
  getPatientSummary
);

router.use('/:patientId/aasis', patientAasiRoutes);

router.get(
  '/:patientId/signatures',
  ...stack,
  requirePermission(PERMISSIONS.SIGNATURES_VIEW),
  listPatientSignatures
);

router.get(
  '/:id',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_VIEW),
  getPatient
);

router.put(
  '/:id',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_UPDATE),
  patientUpdateValidation,
  validate,
  updatePatient
);

router.delete(
  '/:id',
  ...stack,
  requirePermission(PERMISSIONS.PATIENTS_DELETE),
  deletePatient
);

export default router;
