import express from 'express';
import { getAllUserSubscription } from '../../controllers/USER/subscription.user.controller.js';
const router = express.Router();
router.get("/get-all-subscription", getAllUserSubscription);
export default router;
//# sourceMappingURL=subscription.user.routes.js.map