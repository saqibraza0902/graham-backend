import express from 'express'
import { getAllUserBrands } from '../../controllers/USER/brand.user.controller.js';

const router = express.Router()


router.get("/get-all", getAllUserBrands)

export default router;