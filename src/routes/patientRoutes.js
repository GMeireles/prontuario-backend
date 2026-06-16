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
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { patientCreateValidation, patientUpdateValidation } from '../validators/patientValidation.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional', 'assistant']),
  listPatients
);

router.get(
  '/recent',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional', 'assistant']),
  listRecentPatients
);

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  patientCreateValidation,
  validate,
  createPatient
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  patientUpdateValidation,
  validate,
  updatePatient
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin']),
  deletePatient
);

router.get(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  getPatient
);

export default router;
