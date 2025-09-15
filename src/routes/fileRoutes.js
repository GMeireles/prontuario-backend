// routes/fileRoutes.js
import express from 'express';
import { uploadFile, listFiles, downloadFile, deleteFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// upload de arquivo
router.post('/', authMiddleware, roleMiddleware(['professional']), upload.single('file'), uploadFile);

// listar arquivos de um paciente
router.get('/:patientId', authMiddleware, roleMiddleware(['admin', 'professional']), listFiles);

router.get('/:id/download', authMiddleware, downloadFile);

router.delete('/:id', authMiddleware, deleteFile);

export default router;
