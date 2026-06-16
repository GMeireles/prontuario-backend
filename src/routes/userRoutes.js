// routes/userRoutes.js
import express from "express";
import { listUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { tenantContextMiddleware } from "../middleware/tenantContext.js";

const router = express.Router();

// GET /api/users?role=professional
router.get("/", authMiddleware, tenantContextMiddleware, listUsers);

export default router;
