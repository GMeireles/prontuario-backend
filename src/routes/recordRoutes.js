import express from 'express'
import { listRecords, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { tenantContextMiddleware } from '../middleware/tenantContext.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validate } from '../middleware/validate.js'
import { recordCreateValidation, recordUpdateValidation } from '../validators/recordValidation.js'

const router = express.Router()

// Histórico de registros (admin e professional podem ver)
router.get('/:patientId', authMiddleware, tenantContextMiddleware, roleMiddleware(['admin','professional']), listRecords)

// Criar registro clínico (somente professional)
router.post('/:patientId', authMiddleware, tenantContextMiddleware, roleMiddleware(['professional']), recordCreateValidation, validate, createRecord)

// Atualizar registro clínico (somente professional)
router.put('/:id', authMiddleware, tenantContextMiddleware, roleMiddleware(['professional']), recordUpdateValidation, validate, updateRecord)

// Remover registro clínico (somente admin)
router.delete('/:id', authMiddleware, tenantContextMiddleware, roleMiddleware(['admin']), deleteRecord)

export default router
