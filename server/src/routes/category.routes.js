import express from "express";
import {
    createCategory,
    getCategories,
    deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createCategory);
router.get("/", authenticate, getCategories);
router.delete("/:id", authenticate, deleteCategory);

export default router;
