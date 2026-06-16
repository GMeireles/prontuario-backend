import express from 'express';
import { listRecords, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import { recordCreateValidation, recordUpdateValidation } from '../validators/recordValidation.js';

const router = express.Router();

router.get(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_VIEW),
  listRecords
);

router.post(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_CREATE),
  recordCreateValidation,
  validate,
  createRecord
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_UPDATE),
  recordUpdateValidation,
  validate,
  updateRecord
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.EVOLUTIONS_UPDATE),
  deleteRecord
);

export default router;
