import { Request, Response } from 'express'
import { CreateResponse } from '../utils/user/CreateResponse.js'
import { changePasswordValidator, facebookLoginValidation, googleLoginValidation, loginValidator, registerVlidator, updateProfileImageValidator, updateUserProfileValidator, verifyOTPValidator } from '../validators/user.validators.js'
import User, { AuthProviders, RoleEnum } from '../models/User.model.js'
import { createAccessToken } from '../utils/user/createAccessToken.js'
import { comparePassword } from '../utils/user/comparePassword.js'
import { createReturnUser } from '../utils/user/createReturnUser.js'
import { createHashPassword } from '../utils/user/createHashPassword.js'
import { generateResetToken, verifyToken } from '../utils/user/resetToken.js'
import { generateRandomeNumber } from '../utils/user/generateRandomNumbers.js'
import Add from '../models/Add.model.js'
import { UploadImage } from '../lib/imageUpload.js'
export const register = async (req: Request, res: Response) => {
    try {
        const { city, country, email, fullName, password, phoneNumber, state, username, zip_code } = await registerVlidator.validate(req.body)
        const dbUser = await User.findOne({ email: email })
        const dbUsername = await User.findOne({ username: username })
        if (dbUsername) {
            return CreateResponse({ data: { msg: 'Username has been taken.' }, res, statusCode: 400 })
        }
        if (dbUser) {
            return CreateResponse({ data: { msg: 'Email has been taken.' }, res, statusCode: 400 })
        }
        const hashpassword = await createHashPassword(password)
        const otp = generateRandomeNumber({ length: 6 })
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await User.create({
            country,
            email,
            password: hashpassword,
            phoneNumber,
            provider: AuthProviders.EMAIL,
            otp: otp,
            otp_expiry_time: otpExpiry,
            city,
            fullName,
            state,
            username,
            zip_code
        })
        // TODO: Send email token.
        return CreateResponse({ data: { msg: "Verification code has been send to your email." }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = await loginValidator.validate(req.body)
        const dbUser = await User.findOne({ email })
        if (!dbUser) {
            return CreateResponse({ data: { msg: "Incorrect credentials." }, res, statusCode: 400 })
        }
        const isPasswordOkay = await comparePassword(dbUser.password, password)
        if (!isPasswordOkay) {
            return CreateResponse({ data: { msg: "Incorrect credentials." }, res, statusCode: 400 })
        }
        const otp = generateRandomeNumber({ length: 6 })
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        if (!dbUser.varified) {
            await User.findOneAndUpdate({ _id: dbUser._id }, {
                $set: {
                    otp,
                    otp_expiry_time: otpExpiry
                }
            })
            return CreateResponse({ data: { msg: "Verify your email address. Otp sent to you email.", requiredVerification: true }, res, statusCode: 200 })
        }
        const token = createAccessToken({
            _id: String(dbUser._id),
        })
        const user = createReturnUser({
            _id: String(dbUser._id),
            country: dbUser.country,
            email: dbUser.email,
            phoneNumber: dbUser.phoneNumber,
            role: dbUser.role,
            city: dbUser.city,
            fullName: dbUser.fullName,
            state: dbUser.state,
            username: dbUser.username,
            zip_code: dbUser.zip_code,
            profile_image: dbUser.profile_image
        })
        return CreateResponse({ data: { token, user }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const body = req.body as { email: string }
        if (!body.email) {
            return CreateResponse({ data: { msg: "Email is required." }, res, statusCode: 400 })
        }
        const dbUser = await User.findOne({ email: body.email })
        if (!dbUser) {
            return CreateResponse({ data: { msg: "Incorrect email." }, res, statusCode: 400 })
        }
        const resetToken = generateResetToken({ email: body.email })
        await User.findOneAndUpdate({ email: body.email }, {
            $set: {
                resetToken: resetToken
            }
        })
        // TODO: Send email.

        return CreateResponse({ data: { msg: 'Reset password link has been sent to you email.' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const body = req.body as { password: string, reset_token: string }
        if (!body.password) {
            return CreateResponse({ data: { msg: "Password is required." }, res, statusCode: 400 })
        }
        if (!body.reset_token) {
            return CreateResponse({ data: { msg: "Invalid token or token has been expired." }, res, statusCode: 400 })
        }
        const user = await verifyToken(body.reset_token)
        const dbUser = await User.findOne({ email: user.email, resetToken: body.reset_token })
        if (!dbUser) {
            return CreateResponse({ data: { msg: "Invalid token or token has been expired." }, res, statusCode: 400 })
        }
        const hashpassword = await createHashPassword(body.password)
        await User.findOneAndUpdate({ email: dbUser.email }, {
            $set: {
                password: hashpassword,
                resetToken: ""
            }
        })
        return CreateResponse({ data: { msg: "Password changed successfully" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const body = await verifyOTPValidator.validate(req.body)
        const dbUser = await User.findOne({ email: body.email })
        if (!dbUser) {
            return CreateResponse({ data: { msg: "User not found." }, res, statusCode: 400 })
        }
        if (dbUser.otp !== body.otp) {
            return CreateResponse({ data: { msg: "Incorrect otp or otp has been expired." }, res, statusCode: 400 })
        }
        const currentDate = new Date()
        if (currentDate > dbUser.otp_expiry_time) {
            return CreateResponse({ data: { msg: "Incorrect otp or otp has been expired." }, res, statusCode: 400 })
        }
        await User.findOneAndUpdate({ email: dbUser.email }, {
            $set: {
                varified: true,
                otp: ''
            }
        })
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const body = await googleLoginValidation.validate(req.body)
        const checkForUserWithOtherPriveders = await User.findOne({ email: body.email, provider: { $in: [AuthProviders.EMAIL, AuthProviders.FACEBOOK] } })
        if (checkForUserWithOtherPriveders) {
            return CreateResponse({ data: { msg: 'User with this email is already registered.' }, res, statusCode: 400 })
        }
        const dbUser = await User.findOne({ email: body.email, provider: { $nin: [AuthProviders.EMAIL, AuthProviders.FACEBOOK] } })
        if (dbUser) {
            const token = createAccessToken({
                _id: String(dbUser._id),
            })
            const user = createReturnUser({
                _id: String(dbUser._id),
                country: dbUser.country,
                email: dbUser.email,
                phoneNumber: dbUser.phoneNumber,
                role: dbUser.role,
                city: dbUser.city,
                fullName: dbUser.fullName,
                state: dbUser.state,
                username: dbUser.username,
                zip_code: dbUser.zip_code,
                profile_image: dbUser.profile_image
            })
            return CreateResponse({ data: { token, user }, res, statusCode: 200 })
            // create new user...
        } else {
            const newUser = await User.create({
                email: body.email,
                provider: AuthProviders.GOOGLE,
                fullName: body.name ?? "",
                varified: true,
                username: body.email,
            })
            const token = createAccessToken({
                _id: String(newUser._id),
            })
            const user = createReturnUser({
                _id: String(newUser._id),
                country: newUser.country,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                city: newUser.city,
                fullName: newUser.fullName,
                state: newUser.state,
                username: newUser.username,
                zip_code: newUser.zip_code,
                profile_image: newUser.profile_image
            })
            return CreateResponse({ data: { token, user }, res, statusCode: 200 })
        }
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}
export const facebookLogin = async (req: Request, res: Response) => {
    try {
        const body = await facebookLoginValidation.validate(req.body)
        const checkForUserWithOtherPriveders = await User.findOne({ email: body.email, provider: { $in: [AuthProviders.EMAIL, AuthProviders.GOOGLE] } })
        if (checkForUserWithOtherPriveders) {
            return CreateResponse({ data: { msg: 'User with this email is already registered.' }, res, statusCode: 400 })
        }
        const dbUser = await User.findOne({ email: body.email, provider: { $nin: [AuthProviders.EMAIL, AuthProviders.GOOGLE] } })
        if (dbUser) {
            const token = createAccessToken({
                _id: String(dbUser._id),
            })
            const user = createReturnUser({
                _id: String(dbUser._id),
                country: dbUser.country,
                email: dbUser.email,
                phoneNumber: dbUser.phoneNumber,
                role: dbUser.role,
                city: dbUser.city,
                fullName: dbUser.fullName,
                state: dbUser.state,
                username: dbUser.username,
                zip_code: dbUser.zip_code,
                profile_image: dbUser.profile_image
            })
            return CreateResponse({ data: { token, user }, res, statusCode: 200 })
            // create new user...
        } else {
            const newUser = await User.create({
                email: body.email,
                provider: AuthProviders.FACEBOOK,
                country: '',
                firstName: "",
                lastName: "",
                varified: true,
            })
            const token = createAccessToken({
                _id: String(newUser._id),
            })
            const user = createReturnUser({
                _id: String(newUser._id),
                country: newUser.country,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                city: newUser.city,
                fullName: newUser.fullName,
                state: newUser.state,
                username: newUser.username,
                zip_code: newUser.zip_code,
                profile_image: newUser.profile_image
            })
            return CreateResponse({ data: { token, user }, res, statusCode: 200 })
        }
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const body = await changePasswordValidator.validate(req.body)
        const dbUser = await User.findOne({ _id: req.user._id })
        if (!dbUser) {
            return CreateResponse({ data: { msg: 'User not found.' }, res, statusCode: 500 })
        }
        const oldPasswordMatched = await comparePassword(dbUser.password, body.oldPassword)
        if (!oldPasswordMatched) {
            return CreateResponse({ data: { msg: 'Old password not matched.' }, res, statusCode: 500 })
        }
        const hashPassword = await createHashPassword(body.newPassword)
        await User.findByIdAndUpdate(dbUser._id, {
            $set: {
                password: hashPassword
            }
        })
        return CreateResponse({ data: { msg: 'success' }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const getUserBusinessProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }
        const dbUser = await User.findById(id).select('email phoneNumber firstName lastName')
        if (!dbUser) {
            return CreateResponse({ data: { msg: 'User not found.' }, res, statusCode: 400 })
        }
        const products = await Add.find({}, {}, { limit: 9 })
        return CreateResponse({ data: { user: dbUser, products }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const body = await updateUserProfileValidator.validate(req.body)
        const dbUser = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                ...body
            }
        }, {
            new: true
        })
        const user = createReturnUser({
            _id: String(dbUser._id),
            country: dbUser.country,
            email: dbUser.email,
            phoneNumber: dbUser.phoneNumber,
            role: dbUser.role,
            city: dbUser.city,
            fullName: dbUser.fullName,
            state: dbUser.state,
            username: dbUser.username,
            zip_code: dbUser.zip_code,
            profile_image: dbUser.profile_image
        })
        return CreateResponse({ data: { user }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const updateProfileImage = async (req: Request, res: Response) => {
    try {
        const body = await updateProfileImageValidator.validate(req.body)
        const { secure_url } = await UploadImage(body.image)
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                profile_image: secure_url
            }
        })
        return CreateResponse({ data: secure_url, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}