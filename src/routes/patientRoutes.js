import express from 'express'
import { listPatients, createPatient, updatePatient, deletePatient, listRecentPatients, getPatient } from '../controllers/patientController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { patientCreateValidation, patientUpdateValidation } from '../validations/patientValidation.js'

const router = express.Router()

// Listar pacientes (todos os roles podem ver)
router.get('/', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional','assistant']), listPatients)

// Criar paciente (apenas admin e professional)
router.post('/', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional']), patientCreateValidation, validate, createPatient)

// Atualizar paciente (apenas admin e professional)
router.put('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional']), patientUpdateValidation, validate, updatePatient)

// Remover paciente (apenas admin)
router.delete('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin']), deletePatient)

router.get('/recent', authMiddleware, listRecentPatients)

// Retornar 1 paciente
router.get('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional']), getPatient);


export default router
