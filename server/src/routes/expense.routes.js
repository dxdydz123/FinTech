import express from "express";
import {
    createExpense,
    getExpenses,
    deleteExpense,
} from "../controllers/expense.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createExpense);
router.get("/", authenticate, getExpenses);
router.delete("/:id", authenticate, deleteExpense);

export default router;
