import express from 'express'
import { createBrand, deleteBrand, getAllBrands, getAllBrandsWithFiltration, getSingleBrand, updateBrand } from '../controllers/brand.controller.js';

const router = express.Router()

// CREATE BRAND
router.post("/create", createBrand)
// GET ALL BRANDS
router.get("/all-brands", getAllBrands)
// DELETE BRAND
router.delete("/delete/:id", deleteBrand)
// UPDATE BRAND
router.patch("/update/:id", updateBrand)

// GET ALL BRANDS WITH FILTRATION
router.get("/all-brands/filtration", getAllBrandsWithFiltration)

// GET SINGLE BRAND
router.get("/:id", getSingleBrand)
export default router;