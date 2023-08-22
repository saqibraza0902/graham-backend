import express from 'express'
import { createCategory, deleteCategory, getParentCategories, getParentCategoriesWithFiltration, getSingleCategory, getSubCategoriesOfParentCategory, getSubCategoriesOfParentCategoryWithFiltration, updateCategory } from '../controllers/category.controller.js';

const router = express.Router()

// CREATE PARENT/SUB-CATEGORIES
router.post("/create", createCategory)
// GET PARENT CATEGORIES
router.get("/parent/categories", getParentCategories)
// GET SUB-CATEGORIES OF PARENT CAT.
router.get("/sub-categories/:id", getSubCategoriesOfParentCategory)
// DELETE A CATEGORY
router.delete("/:id", deleteCategory)
// UPDATE CATEGORY
router.patch("/:id", updateCategory)

// GET CATEGORIES WITH FILTRATION
router.get("/parent/categories/filtration", getParentCategoriesWithFiltration)
// GET SUBCATEGORIES WITH FILTRATION
router.get("/sub-categories/filtration/:id", getSubCategoriesOfParentCategoryWithFiltration)
// GET SINGLE CATEGORY ID
router.get("/:id", getSingleCategory)
export default router;