import express from 'express';
import { uploadFile, listFiles, downloadFile, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { upload } from '../utils/upload.js';
import { PERMISSIONS } from '../config/permissions.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.FILES_UPLOAD),
  upload.single('file'),
  uploadFile
);

router.get(
  '/:id/download',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.FILES_DOWNLOAD),
  downloadFile
);

router.get(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.FILES_VIEW),
  listFiles
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  requirePermission(PERMISSIONS.FILES_UPLOAD),
  deleteFile
);

export default router;
