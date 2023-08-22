import express from 'express'
import { changePassword, facebookLogin, forgetPassword, getUserBusinessProfile, googleLogin, login, register, resetPassword, updateProfileImage, updateUserProfile, verifyOTP } from '../controllers/auth.controller.js';
import { requireSignInMiddleware } from '../middlewares/index.js';

const router = express.Router()

// Register
router.post('/register', register);
// Login
router.post('/login', login)
// Forget-password
router.post('/forget-password', forgetPassword)
// Reset-password
router.post("/reset-password", resetPassword)
// Verify_Otp
router.post("/verify-otp", verifyOTP)
// .............................................Social logins...................................
// Google login/sign up
router.post("/google/login", googleLogin)
// Facebook login/sign up
router.post("/facebook/login", facebookLogin)
// .............................................Social logins...................................
// CHANGE PASSWORD
router.post("/change-password", requireSignInMiddleware, changePassword)
// GET USER BUSINESS PROFILE
router.get("/user/business-profile/:id", getUserBusinessProfile)
// UPDATE USER PROFILE
router.post("/update/user/profile", requireSignInMiddleware, updateUserProfile)
// UPDATE USER PROFILE IMAGE
router.post("/update/user/profile-image", requireSignInMiddleware, updateProfileImage)
export default router;