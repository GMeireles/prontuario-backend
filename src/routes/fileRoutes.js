// routes/fileRoutes.js
import express from 'express';
import { uploadFile, listFiles } from '../controllers/fileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// upload de arquivo
router.post('/', authMiddleware, roleMiddleware(['professional']), upload.single('file'), uploadFile);

// listar arquivos de um paciente
router.get('/:patientId', authMiddleware, roleMiddleware(['admin', 'professional']), listFiles);

export default router;
