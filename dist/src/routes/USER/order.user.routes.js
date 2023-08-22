import express from 'express';
import { requireSignInMiddleware } from '../../middlewares/index.js';
import { createCheckoutSession, handleCancelledOrderByStripe, verifyOrder } from '../../controllers/USER/order.user.controller.js';
const router = express.Router();
// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", requireSignInMiddleware, createCheckoutSession);
// VERIFY ORDERS
router.post("/verify-checkout-sessions/:id", verifyOrder);
// HANDLE CANCELLED ORDER BY STRIPE
router.post("/cancel-checkout-sessions/:id", handleCancelledOrderByStripe);
export default router;
//# sourceMappingURL=order.user.routes.js.map