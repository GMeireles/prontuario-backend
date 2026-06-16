import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import recordRoutes from './recordRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import anamneseRoutes from './anamneseRoutes.js';
import anamneseTemplateRoutes from './anamneseTemplateRoutes.js';
import signatureRoutes from './signatureRoutes.js';
import evolutionRoutes from './evolutionRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import fileRoutes from './fileRoutes.js';
import prescriptionFileRoutes from './prescriptionFileRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import userRoutes from './userRoutes.js';
import billingRoutes from './billingRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/billing', billingRoutes);
router.use('/patients', patientRoutes);
router.use('/records', recordRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/anamneses', anamneseRoutes);
router.use('/anamnese-templates', anamneseTemplateRoutes);
router.use('/signatures', signatureRoutes);
router.use('/evolutions', evolutionRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/prescriptions', prescriptionFileRoutes);
router.use('/files', fileRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);

export default router;
