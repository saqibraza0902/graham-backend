import express from "express";
import { getUserParentCategories, getUserSubCategoriesOfParentCategories } from "../../controllers/USER/category.user.controller.js";
const router = express.Router();
// get-parent-cat
router.get("/parent-categories", getUserParentCategories);
// get-sub-cat
router.get("/sub-category/:id", getUserSubCategoriesOfParentCategories);
export default router;
//# sourceMappingURL=category.user.routes.js.map