import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { prescriptionFileAddValidation } from '../validators/prescriptionFileValidation.js';
import {
  addFileToPrescription,
  listPrescriptionFiles,
  removeFileFromPrescription
} from '../controllers/prescriptionFileController.js';

const router = express.Router();

router.post(
  '/:prescriptionId/files',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_UPDATE),
  prescriptionFileAddValidation,
  validate,
  addFileToPrescription
);

router.get(
  '/:prescriptionId/files',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_VIEW),
  listPrescriptionFiles
);

router.delete(
  '/:prescriptionId/files/:fileId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.PRESCRIPTIONS_UPDATE),
  removeFileFromPrescription
);

export default router;
