import express from 'express';
import { createPrescription, listPrescriptions, updatePrescription, deletePrescription } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { prescriptionCreateValidation, prescriptionUpdateValidation } from '../validators/prescriptionValidation.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  prescriptionCreateValidation,
  validate,
  createPrescription
);

router.get(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listPrescriptions
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  prescriptionUpdateValidation,
  validate,
  updatePrescription
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  deletePrescription
);

export default router;
