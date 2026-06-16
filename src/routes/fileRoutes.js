import express from 'express';
import { uploadFile, listFiles, downloadFile, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  upload.single('file'),
  uploadFile
);

router.get(
  '/:id/download',
  authMiddleware,
  tenantContextMiddleware,
  downloadFile
);

router.get(
  '/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listFiles
);

router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  deleteFile
);

export default router;
