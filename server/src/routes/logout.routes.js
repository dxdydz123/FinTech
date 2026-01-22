import express from "express";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", logout);

export default router;