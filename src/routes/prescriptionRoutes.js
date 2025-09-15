// routes/prescriptionRoutes.js
import express from 'express';
import { createPrescription, listPrescriptions, updatePrescription, deletePrescription } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { prescriptionCreateValidation, prescriptionUpdateValidation } from '../validations/prescriptionValidation.js';

const router = express.Router();

// Criar prescrição
router.post('/', authMiddleware, roleMiddleware(['professional']), prescriptionCreateValidation, validate, createPrescription);

// Listar prescrições de um paciente
router.get('/:patientId', authMiddleware, roleMiddleware(['admin', 'professional']), listPrescriptions);

// Atualizar prescrição
router.put('/:id', authMiddleware, roleMiddleware(['professional']), prescriptionUpdateValidation, validate, updatePrescription);

// Excluir prescrição
router.delete('/:id', authMiddleware, roleMiddleware(['professional']), deletePrescription);

export default router;
