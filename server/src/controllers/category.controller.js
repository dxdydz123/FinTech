import prisma from "../config/db.js";

export const createCategory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Category name is required",
            });
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                name: name.trim(),
                userId: req.user.id,
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "Category already exists",
            });
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                userId: req.user.id,
            },
        });

        return res.status(201).json(category);
    } catch (error) {
        console.error("CREATE CATEGORY ERROR:", error);
        return res.status(500).json({
            message: "Failed to create category",
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return res.status(200).json(categories);
    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch categories",
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        await prisma.category.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error);
        return res.status(500).json({
            message: "Failed to delete category",
        });
    }
};
