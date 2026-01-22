import express from "express";
import { createBudget } from "../controllers/budget.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getBudgetStatus } from "../controllers/budget.controller.js";
const router = express.Router();
router.get("/status", authenticate, getBudgetStatus);
router.post("/", authenticate, createBudget);

export default router;
