import express from 'express';
import { createEvolution, listEvolutions, updateEvolution, deleteEvolution } from '../controllers/evolutionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { evolutionCreateValidation, evolutionUpdateValidation } from '../validators/evolutionValidation.js';

const router = express.Router();

router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_CREATE),
  evolutionCreateValidation,
  validate,
  createEvolution
);

router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_VIEW),
  listEvolutions
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_UPDATE),
  evolutionUpdateValidation,
  validate,
  updateEvolution
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_UPDATE),
  deleteEvolution
);

export default router;
