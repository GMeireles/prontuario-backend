// routes/anamneseRoutes.js
import express from 'express';
import { createAnamnese, listAnamneses, updateAnamnese, deleteAnamnese } from '../controllers/anamneseController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { anamneseCreateValidation, anamneseUpdateValidation } from '../validations/anamneseValidation.js';

const router = express.Router();

// Criar anamnese
router.post('/', authMiddleware, roleMiddleware(['professional']), anamneseCreateValidation, validate, createAnamnese);

// Listar anamneses de um paciente
router.get('/:patientId', authMiddleware, roleMiddleware(['admin', 'professional']), listAnamneses);

// Atualizar anamnese
router.put('/:id', authMiddleware, roleMiddleware(['professional']), anamneseUpdateValidation, validate, updateAnamnese);

// Excluir anamnese
router.delete('/:id', authMiddleware, roleMiddleware(['professional']), deleteAnamnese);

export default router;
