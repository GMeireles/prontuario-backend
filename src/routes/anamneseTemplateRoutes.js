import express from 'express';
import {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  addTemplateField,
  updateTemplateField,
  deleteTemplateField
} from '../controllers/anamneseTemplateController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/permissions.js';
import {
  templateCreateValidation,
  templateUpdateValidation,
  templateFieldCreateValidation,
  templateFieldUpdateValidation
} from '../validators/anamneseTemplateValidation.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_VIEW),
  listTemplates
);

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_CREATE),
  templateCreateValidation,
  validate,
  createTemplate
);

router.get(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_VIEW),
  getTemplate
);

router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_UPDATE),
  templateUpdateValidation,
  validate,
  updateTemplate
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_DELETE),
  deleteTemplate
);

router.post(
  '/:id/fields',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_UPDATE),
  templateFieldCreateValidation,
  validate,
  addTemplateField
);

router.put(
  '/:id/fields/:fieldId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_UPDATE),
  templateFieldUpdateValidation,
  validate,
  updateTemplateField
);

router.delete(
  '/:id/fields/:fieldId',
  authMiddleware,
  tenantContextMiddleware,
  requireActiveSubscription,
  requirePermission(PERMISSIONS.ANAMNESE_TEMPLATES_UPDATE),
  deleteTemplateField
);

export default router;
