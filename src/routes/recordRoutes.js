import express from 'express'
import { listRecords, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { recordCreateValidation, recordUpdateValidation } from '../validations/recordValidation.js'

const router = express.Router()

// Histórico de registros (admin e professional podem ver)
router.get('/:patientId', authMiddleware, tenantMiddleware, roleMiddleware(['admin','professional']), listRecords)

// Criar registro clínico (somente professional)
router.post('/:patientId', authMiddleware, tenantMiddleware, roleMiddleware(['professional']), recordCreateValidation, validate, createRecord)

// Atualizar registro clínico (somente professional)
router.put('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['professional']), recordUpdateValidation, validate, updateRecord)

// Remover registro clínico (somente admin)
router.delete('/:id', authMiddleware, tenantMiddleware, roleMiddleware(['admin']), deleteRecord)

export default router
