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
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
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
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  listTodayAppointments
);

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_VIEW),
  listAppointments
);

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_CREATE),
  appointmentCreateValidation,
  validate,
  createAppointment
);

router.put(
  '/:id/cancel',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_UPDATE),
  appointmentCancelValidation,
  validate,
  cancelAppointment
);

router.put(
  '/:id/confirm',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_UPDATE),
  confirmAppointment
);

router.put(
  '/:id/complete',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_UPDATE),
  completeAppointment
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_UPDATE),
  appointmentUpdateValidation,
  validate,
  updateAppointment
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_DELETE),
  deleteAppointment
);

export default router;
