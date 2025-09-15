import express from 'express'
import { listAppointments, createAppointment, updateAppointment, deleteAppointment, cancelAppointment, confirmAppointment, completeAppointment } from '../controllers/appointmentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { appointmentCreateValidation, appointmentUpdateValidation, appointmentCancelValidation } from '../validations/appointmentValidation.js';

const router = express.Router()

// Listar consultas (todos os roles podem ver)
router.get('/', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional','assistant']), listAppointments)

// Criar consulta (todos os roles podem agendar)
router.post('/', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional','assistant']), appointmentCreateValidation, validate, createAppointment)

// Atualizar consulta (todos os roles podem editar)
router.put('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional','assistant']), appointmentUpdateValidation, validate, updateAppointment)

// Remover consulta (somente admin e professional)
router.delete('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional']), deleteAppointment)

// Atualizar / reagendar
router.put('/:id', authMiddleware, roleMiddleware(['professional']), appointmentUpdateValidation, validate, updateAppointment);

// Cancelar
router.put('/:id/cancel', authMiddleware, roleMiddleware(['professional']), appointmentCancelValidation, validate, cancelAppointment);

// Confirmar
router.put('/:id/confirm', authMiddleware, roleMiddleware(['professional']), confirmAppointment);

// Concluir
router.put('/:id/complete', authMiddleware, roleMiddleware(['professional']), completeAppointment);

export default router
