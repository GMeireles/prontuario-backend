import express from 'express';
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  listRecentPatients,
  getPatient
} from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { patientCreateValidation, patientUpdateValidation } from '../validators/patientValidation.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PATIENTS_VIEW),
  listPatients
);

router.get(
  '/recent',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  listRecentPatients
);

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PATIENTS_CREATE),
  patientCreateValidation,
  validate,
  createPatient
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PATIENTS_UPDATE),
  patientUpdateValidation,
  validate,
  updatePatient
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PATIENTS_DELETE),
  deletePatient
);

router.get(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PATIENTS_VIEW),
  getPatient
);

export default router;
