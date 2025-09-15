import express from 'express';
import { createTenant, listTenants, getTenant, updateTenant, deleteTenant } from '../controllers/tenantController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apenas admin master deve acessar essas rotas
router.post('/', authMiddleware, roleMiddleware(['admin']), createTenant);
router.get('/', authMiddleware, roleMiddleware(['admin']), listTenants);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getTenant);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateTenant);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteTenant);

export default router;
