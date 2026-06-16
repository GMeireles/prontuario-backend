import express from 'express';
import {
  listPatientAasis,
  getPatientAasi,
  createPatientAasi,
  updatePatientAasi,
  deletePatientAasi
} from '../controllers/patientAasiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import {
  patientAasiListValidation,
  patientAasiGetValidation,
  patientAasiCreateValidation,
  patientAasiUpdateValidation,
  patientAasiDeleteValidation
} from '../validators/patientAasiValidation.js';

const router = express.Router({ mergeParams: true });

const stack = [authMiddleware, tenantContextMiddleware, requireActiveSubscription];

router.get(
  '/',
  ...stack,
  requirePermission(PERMISSIONS.AASIS_VIEW),
  patientAasiListValidation,
  validate,
  listPatientAasis
);

router.post(
  '/',
  ...stack,
  requirePermission(PERMISSIONS.AASIS_CREATE),
  patientAasiCreateValidation,
  validate,
  createPatientAasi
);

router.get(
  '/:aasiId',
  ...stack,
  requirePermission(PERMISSIONS.AASIS_VIEW),
  patientAasiGetValidation,
  validate,
  getPatientAasi
);

router.put(
  '/:aasiId',
  ...stack,
  requirePermission(PERMISSIONS.AASIS_UPDATE),
  patientAasiUpdateValidation,
  validate,
  updatePatientAasi
);

router.delete(
  '/:aasiId',
  ...stack,
  requirePermission(PERMISSIONS.AASIS_DELETE),
  patientAasiDeleteValidation,
  validate,
  deletePatientAasi
);

export default router;
