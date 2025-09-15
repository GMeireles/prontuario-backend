// routes/evolutionRoutes.js
import express from 'express';
import { createEvolution, listEvolutions, updateEvolution, deleteEvolution } from '../controllers/evolutionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { evolutionCreateValidation, evolutionUpdateValidation } from '../validations/evolutionValidation.js';

const router = express.Router();

// Criar evolução
router.post('/', authMiddleware, roleMiddleware(['professional']), evolutionCreateValidation, validate, createEvolution);

// Listar evoluções de um paciente
router.get('/:patientId', authMiddleware, roleMiddleware(['admin', 'professional']), listEvolutions);

// Atualizar evolução
router.put('/:id', authMiddleware, roleMiddleware(['professional']), evolutionUpdateValidation, validate, updateEvolution);

// Excluir evolução
router.delete('/:id', authMiddleware, roleMiddleware(['professional']), deleteEvolution);

export default router;
