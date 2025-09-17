// routes/evolutionRoutes.js
import express from 'express';
import { createEvolution, listEvolutions, updateEvolution, deleteEvolution } from '../controllers/evolutionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js'
import { validate } from '../middlewares/validate.js';
import { evolutionCreateValidation, evolutionUpdateValidation } from '../validations/evolutionValidation.js';

const router = express.Router();

// Criar evolução
router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  evolutionCreateValidation,
  validate,
  createEvolution
)

// Listar evoluções
router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['admin', 'professional']),
  listEvolutions
)

// Atualizar
router.put(
  '/:id',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  evolutionUpdateValidation,
  validate,
  updateEvolution
)

// Excluir
router.delete(
  '/:id',
  authMiddleware,
  tenantMiddleware,
  roleMiddleware(['professional']),
  deleteEvolution
)


export default router;
