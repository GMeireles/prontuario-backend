import express from 'express';
import { getSignature } from '../controllers/signatureController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.SIGNATURES_VIEW),
  getSignature
);

export default router;
