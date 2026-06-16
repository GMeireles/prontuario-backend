import express from 'express';
import { listUsers, listProfessionals } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get(
  '/professionals',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.APPOINTMENTS_CREATE),
  listProfessionals
);

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.USERS_VIEW),
  listUsers
);

export default router;
