import express from 'express'
import { createTax, deleteTax, getAllTaxes, getAllTaxesWithFiltration, getSingleTax, updateTax } from '../controllers/tax.controller.js';
const router = express.Router()

// CREATE TAX
router.post("/create", createTax)
// DELETE TAX
router.delete('/:id', deleteTax)
// GET ALL TAXES
router.get("/all-taxes", getAllTaxes)
// UPDATE TAX
router.patch('/update/:id', updateTax)
// GET ALL TAXES WITH FILTRATION
router.get("/all-taxes/filtration", getAllTaxesWithFiltration)
// GET SINGLE TAX BY ID
router.get("/single/tax/:id", getSingleTax)
export default router;