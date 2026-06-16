import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
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
  roleMiddleware(['admin', 'professional']),
  prescriptionFileAddValidation,
  validate,
  addFileToPrescription
);

router.get(
  '/:prescriptionId/files',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listPrescriptionFiles
);

router.delete(
  '/:prescriptionId/files/:fileId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  removeFileFromPrescription
);

export default router;
