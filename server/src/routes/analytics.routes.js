import express from "express";
import {
    getMonthlySummary,
    getCategoryBreakdown,
    getSpendingTrends,
} from "../controllers/analytics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/monthly-summary", authenticate, getMonthlySummary);
router.get("/category-breakdown", authenticate, getCategoryBreakdown);
router.get("/trends", authenticate, getSpendingTrends);

export default router;
