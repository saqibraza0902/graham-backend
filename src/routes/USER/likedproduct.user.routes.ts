import express from 'express'
import { requireSignInMiddleware } from '../../middlewares/index.js';
import { likeProduct, unlikeProduct } from '../../controllers/USER/likedProducts.controller.js';

const router = express.Router()

// LIKE PRODUCT
router.post('/like-product', requireSignInMiddleware, likeProduct)
// UNLIKE PRODUCT
router.post("/unlike-product", requireSignInMiddleware, unlikeProduct)

export default router;