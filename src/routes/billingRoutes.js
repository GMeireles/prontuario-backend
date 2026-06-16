import express from 'express';
import {
  listPlans,
  getSubscription,
  createCheckout,
  createPortal
} from '../controllers/billingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.get('/plans', listPlans);

router.get(
  '/subscription',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.BILLING_VIEW),
  getSubscription
);

router.post(
  '/checkout',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.BILLING_MANAGE),
  createCheckout
);

router.post(
  '/portal',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.BILLING_MANAGE),
  createPortal
);

export default router;
