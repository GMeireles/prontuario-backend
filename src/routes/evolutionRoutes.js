// routes/evolutionRoutes.js
import express from 'express';
import { createEvolution, listEvolutions, updateEvolution, deleteEvolution } from '../controllers/evolutionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { tenantContextMiddleware } from '../middleware/tenantContext.js'
import { validate } from '../middleware/validate.js';
import { evolutionCreateValidation, evolutionUpdateValidation } from '../validators/evolutionValidation.js';

const router = express.Router();

// Criar evolução
router.post(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['professional']),
  evolutionCreateValidation,
  validate,
  createEvolution
)

// Listar evoluções
router.get(
  '/patient/:patientId',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['admin', 'professional']),
  listEvolutions
)

// Atualizar
router.put(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['professional']),
  evolutionUpdateValidation,
  validate,
  updateEvolution
)

// Excluir
router.delete(
  '/:id',
  authMiddleware,
  tenantContextMiddleware,
  roleMiddleware(['professional']),
  deleteEvolution
)


export default router;
