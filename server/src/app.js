import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";



const app = express();

app.use(cors());
app.use(express.json()); // 👈 MUST be BEFORE routes

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
