import express from 'express'
import { change_add_status, createAdd, deleteAdd, disableAdd, getAllAdds, getDescriptionPageAddWithDetails, getSingleAdd, searchAdds, unableAdd, updateAdd, user_adds_with_pagination } from '../../controllers/USER/add.user.controller.js';
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

// GET USER ADDS WITH FILTRATION
router.get("/user_adds_with_pagination", requireSignInMiddleware, user_adds_with_pagination)

// CHANGE ADD STATUS API.
router.post("/add-status/:pid", requireSignInMiddleware, change_add_status)

export default router;