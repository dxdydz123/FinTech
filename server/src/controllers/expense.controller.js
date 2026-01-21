import prisma from "../config/db.js";

export const createExpense = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            return res.status(400).json({
                message: "Amount must be a number",
            });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({
                message: "Invalid date format",
            });
        }

        const expense = await prisma.expense.create({
            data: {
                title,
                amount: numericAmount,
                category,
                date: parsedDate,
                userId: req.user.id,
            },
        });

        return res.status(201).json(expense);
    } catch (error) {
        console.error("CREATE EXPENSE ERROR:", error);
        return res.status(500).json({
            message: "Failed to create expense",
        });
    }
};


export const getExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                date: "desc",
            },
        });

        return res.status(200).json(expenses);
    } catch (error) {
        console.error("GET EXPENSES ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch expenses",
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await prisma.expense.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        await prisma.expense.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Expense deleted successfully",
        });
    } catch (error) {
        console.error("DELETE EXPENSE ERROR:", error);
        return res.status(500).json({
            message: "Failed to delete expense",
        });
    }
};
