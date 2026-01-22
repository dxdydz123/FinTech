import prisma from "../config/db.js";

export const getMonthlySummary = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "month and year are required",
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const result = await prisma.expense.aggregate({
            where: {
                userId: req.user.id,
                date: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            _sum: {
                amount: true,
            },
            _count: true,
        });

        return res.status(200).json({
            month,
            year,
            totalSpent: result._sum.amount || 0,
            totalTransactions: result._count,
        });
    } catch (error) {
        console.error("MONTHLY SUMMARY ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch monthly summary",
        });
    }
};

export const getCategoryBreakdown = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "month and year are required",
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const expenses = await prisma.expense.findMany({
            where: {
                userId: req.user.id,
                date: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            select: {
                category: true,
                amount: true,
            },
        });

        const breakdown = {};

        expenses.forEach((expense) => {
            breakdown[expense.category] =
                (breakdown[expense.category] || 0) + expense.amount;
        });

        return res.status(200).json(breakdown);
    } catch (error) {
        console.error("CATEGORY BREAKDOWN ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch category breakdown",
        });
    }
};

export const getSpendingTrends = async (req, res) => {
    try {
        const months = Number(req.query.months || 6);
        const now = new Date();

        const trends = [];

        for (let i = months - 1; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const result = await prisma.expense.aggregate({
                where: {
                    userId: req.user.id,
                    date: {
                        gte: start,
                        lt: end,
                    },
                },
                _sum: {
                    amount: true,
                },
            });

            trends.push({
                month: start.getMonth() + 1,
                year: start.getFullYear(),
                totalSpent: result._sum.amount || 0,
            });
        }

        return res.status(200).json(trends);
    } catch (error) {
        console.error("SPENDING TRENDS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch spending trends",
        });
    }
};
