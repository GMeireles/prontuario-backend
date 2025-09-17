// routes/userRoutes.js
import express from "express";
import { listUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { tenantMiddleware } from "../middlewares/tenantMiddleware.js";

const router = express.Router();

// GET /api/users?role=professional
router.get("/", authMiddleware, tenantMiddleware, listUsers);

export default router;
