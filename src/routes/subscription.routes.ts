import express from 'express'
import { createSubscription, deleteSubscription, getAllSubscriptions, getAllSubscriptionsWithFilters, getSingleSubscription, updateSubscription } from '../controllers/subscription.controller.js';
const router = express.Router()

// CREATE
router.post("/create", createSubscription)
// Delete 
router.delete("/:id", deleteSubscription)
// GET ALL SUBSCRIPTIONS
router.get("/all-subscriptions", getAllSubscriptions)
// UPDATE
router.patch("/update/:id", updateSubscription)
// GET ALL SUBSCRIPTIONS WITH FILTRATION
router.get("/all-subscriptions/filtration", getAllSubscriptionsWithFilters)
// GET SINGLE SUBSCRIPTION
router.get("/:id", getSingleSubscription)

export default router;