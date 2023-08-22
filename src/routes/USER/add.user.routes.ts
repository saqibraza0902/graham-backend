import express from 'express'
import { createAdd, deleteAdd, disableAdd, getAllAdds, getDescriptionPageAddWithDetails, getSingleAdd, searchAdds, unableAdd, updateAdd } from '../../controllers/USER/add.user.controller.js';
import { attachTokenUserId, requireSignInMiddleware } from '../../middlewares/index.js';
const router = express.Router()

// CREATE ADD
router.post('/create-add', requireSignInMiddleware, createAdd)
// DELETE ADD
router.delete("/remove/add/:id", requireSignInMiddleware, deleteAdd)
// UPDATE ADD
router.patch('/update/add/:id', requireSignInMiddleware, updateAdd)
// GET ALL ADDS
router.get("/adds", getAllAdds)
// GET SINGLE ADD BY ID:
router.get("/add/:id", getSingleAdd)
// SEARCH ADD
router.post("/search/adds", attachTokenUserId, searchAdds)
// DISABLE ADD
router.patch("/disable/add/:id", requireSignInMiddleware, disableAdd)
// UNABLE THE DISABLED ADD
router.patch('/unable/add/:id', requireSignInMiddleware, unableAdd)
// GET DESCRIPTION PAGE ADD WITH DETAILS
router.get("/add-description-page/:id", attachTokenUserId, getDescriptionPageAddWithDetails)

// 
export default router;