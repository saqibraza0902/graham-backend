import express from 'express';
import { getAllOrderListingsWithFiltration, getCompletedOrdersOfAProduct, getSellerAllOrdersWithFiltration, getSingleOrderDetails, getSubscriptionOrdersOnlyWithFiltration, orders_with_payment_status_payed } from '../controllers/order.controller.js';
const router = express.Router();
// GET COMPLETED ORDERS OF PRODUCT WITH FILTRATION.
router.get("/completed-order/:pid", getCompletedOrdersOfAProduct);
// GET ALL ORDERS OF SELLER WITH filtration.
router.get("/seller-orders/:seller_id", getSellerAllOrdersWithFiltration);
// GET ALL ORDERS WITH FILTRATION
router.get("/all/orders", getAllOrderListingsWithFiltration);
// get single order by Its ID.
router.get("/single-order/:order_id", getSingleOrderDetails);
// GET ALL ORDERS WHERE THE PRODUCTS WERE CREATED WITH PLANS
router.get("/orders-with-subscription-bought-products", getSubscriptionOrdersOnlyWithFiltration);
// GET ORDERS WITH PAYMENT STATUS PAID ONLY WITH FILTRATION
router.get("/orders-with-payment-status-payed", orders_with_payment_status_payed);
export default router;
//# sourceMappingURL=order.routes.js.map