import express from 'express'
import { getBuyerWithFiltration, getSellersWithFiltration, getSingleUserAllOrdersFiltration, getUserProfile, get_dashboard_analytics } from '../controllers/user.controller.js';


const router = express.Router()

// GET USER PROFILE
router.get("/user-profile/:id", getUserProfile)
// GET SELLERS WITH AT-LEAST ONE PRODUCT CREATED / FILTRATION
router.get("/get/sellers/filtration", getSellersWithFiltration)
// GET BUYER WITH AT-LEAST ONE PRODUCT CREATED / FILTRATION
router.get("/get/buyers/filtration", getBuyerWithFiltration)
// GET ALL USER ORDERS WITH FILTRATION.
router.get("/orders/:uid", getSingleUserAllOrdersFiltration)

// DASHBOARD ANALYTICS API
router.get("/dashboard-analytics", get_dashboard_analytics)
export default router;