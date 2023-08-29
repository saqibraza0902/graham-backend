import express from 'express'
import { requireSignInMiddleware } from '../../middlewares/index.js';
import { create_user_onboarding_account, seller_account_analytics } from '../../controllers/USER/user.user.controller.js';

const router = express.Router()

// GET SELLER ANALYTICS DATA.
router.get("/seller-analytics", requireSignInMiddleware, seller_account_analytics)
// CREATE USER ON-BOARDING ACCOUNT
router.get("/create-account", requireSignInMiddleware, create_user_onboarding_account)

export default router;