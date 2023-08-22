import express from 'express';
import { getPostsAdd, getProductWithOrdersStatuses, getUserPostsWithPagination } from '../controllers/add.controller.js';
const router = express.Router();
// GET ADD POSTS.
router.get("/add-posts", getPostsAdd);
// GET USER ADDS WITH PAGINATION
router.post("/user-adds", getUserPostsWithPagination);
// completed orders, active order, cancelled orders, pending orders,
router.get("/product-with-orders-detail/:id", getProductWithOrdersStatuses);
export default router;
//# sourceMappingURL=add.routes.js.map