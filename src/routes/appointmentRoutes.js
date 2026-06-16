import express from 'express';
import {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  listTodayAppointments
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  appointmentCreateValidation,
  appointmentUpdateValidation,
  appointmentCancelValidation
} from '../validators/appointmentValidation.js';

const router = express.Router();

router.get(
  '/today',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listTodayAppointments
);

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional', 'assistant']),
  listAppointments
);

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional', 'assistant']),
  appointmentCreateValidation,
  validate,
  createAppointment
);

router.put(
  '/:id/cancel',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  appointmentCancelValidation,
  validate,
  cancelAppointment
);

router.put(
  '/:id/confirm',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  confirmAppointment
);

router.put(
  '/:id/complete',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  completeAppointment
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional', 'assistant']),
  appointmentUpdateValidation,
  validate,
  updateAppointment
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  deleteAppointment
);

export default router;
