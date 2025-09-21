// routes/prescriptionFileRoutes.js
import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { prescriptionFileAddValidation } from '../validations/prescriptionFileValidation.js'
import {
  addFileToPrescription,
  listPrescriptionFiles,
  removeFileFromPrescription
} from '../controllers/prescriptionFileController.js'

const router = express.Router()

// Adicionar arquivo a uma prescrição
router.post(
  '/:prescriptionId/files',
  authMiddleware,
  roleMiddleware(['admin', 'professional']),
  prescriptionFileAddValidation,
  validate,
  addFileToPrescription
)

// Listar arquivos de uma prescrição
router.get(
  '/:prescriptionId/files',
  authMiddleware,
  roleMiddleware(['admin', 'professional']),
  listPrescriptionFiles
)

// Remover arquivo de uma prescrição
router.delete(
  '/:prescriptionId/files/:fileId',
  authMiddleware,
  roleMiddleware(['admin', 'professional']),
  removeFileFromPrescription
)

export default router
