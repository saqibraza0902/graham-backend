import express from 'express';
import { requireSignInMiddleware } from '../../middlewares/index.js';
import { buyer_invoices, change_order_process_status, createCheckoutSession, get_buyer_analytics, get_buyer_orders, get_seller_orders, handleCancelledOrderByStripe, last_seven_days_order_invoices, seller_subscriptions_orders, verifyOrder } from '../../controllers/USER/order.user.controller.js';
const router = express.Router();
// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", requireSignInMiddleware, createCheckoutSession);
// VERIFY ORDERS
router.post("/verify-checkout-sessions/:id", verifyOrder);
// HANDLE CANCELLED ORDER BY STRIPE
router.post("/cancel-checkout-sessions/:id", handleCancelledOrderByStripe);
// GET USER LAST 7-DAYS ORDERS INVOICES.
router.get('/orders-last-seven-days', requireSignInMiddleware, last_seven_days_order_invoices);
// GET SELLER ORDERS
router.get("/seller-orders/:seller_id", requireSignInMiddleware, get_seller_orders);
// UPDATE SELLER ORDER STATUS
router.patch("/seller/order-status-update", requireSignInMiddleware, change_order_process_status);
// GET SELLER SUBSCRIPTIONS ORDERS.
router.get("/seller/subscription-orders", requireSignInMiddleware, seller_subscriptions_orders);
// GET BUYER ORDERS
router.get("/buyer-orders/:buyer_id", requireSignInMiddleware, get_buyer_orders);
// GET BUYER INVOICES DATA
router.get("/buyer/invoice/data", requireSignInMiddleware, buyer_invoices);
// GET BUYER ANALYTICS
router.get("/buyer-analytics", requireSignInMiddleware, get_buyer_analytics);
export default router;
//# sourceMappingURL=order.user.routes.js.map