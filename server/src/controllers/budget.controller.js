import prisma from "../config/db.js";

export const createBudget = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { categoryId, amount, month, year } = req.body;

        if (!categoryId || !amount || !month || !year) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                message: "Budget amount must be a positive number",
            });
        }

        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.user.id,
            },
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId: req.user.id,
                categoryId,
                month,
                year,
            },
        });

        if (existingBudget) {
            return res.status(409).json({
                message: "Budget already exists for this category and month",
            });
        }

        const budget = await prisma.budget.create({
            data: {
                amount: numericAmount,
                month,
                year,
                userId: req.user.id,
                categoryId,
            },
        });

        return res.status(201).json(budget);
    } catch (error) {
        console.error("CREATE BUDGET ERROR:", error);
        return res.status(500).json({
            message: "Failed to create budget",
        });
    }
};
export const getBudgetStatus = async (req, res) => {
    try {
        const { categoryId, month, year } = req.query;

        if (!categoryId || !month || !year) {
            return res.status(400).json({
                message: "categoryId, month and year are required",
            });
        }

        const budget = await prisma.budget.findFirst({
            where: {
                userId: req.user.id,
                categoryId,
                month: Number(month),
                year: Number(year),
            },
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not set for this category",
            });
        }

        const expenses = await prisma.expense.aggregate({
            where: {
                userId: req.user.id,
                category: {
                    equals: undefined,
                },
                date: {
                    gte: new Date(year, month - 1, 1),
                    lt: new Date(year, month, 1),
                },
            },
            _sum: {
                amount: true,
            },
        });

        const spent = expenses._sum.amount || 0;
        const remaining = budget.amount - spent;

        return res.status(200).json({
            budget: budget.amount,
            spent,
            remaining,
            overBudget: remaining < 0,
        });
    } catch (error) {
        console.error("GET BUDGET STATUS ERROR:", error);
        return res.status(500).json({
            message: "Failed to get budget status",
        });
    }
};


