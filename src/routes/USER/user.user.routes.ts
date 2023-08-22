import express from 'express'
import { requireSignInMiddleware } from '../../middlewares/index.js';
import { seller_account_analytics } from '../../controllers/USER/user.user.controller.js';

const router = express.Router()

// GET SELLER ANALYTICS DATA.
router.get("/seller-analytics", requireSignInMiddleware, seller_account_analytics)


export default router;