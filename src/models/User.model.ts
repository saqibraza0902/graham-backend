import mongoose from "mongoose";
import { string } from "yup";
export enum RoleEnum {
    USER = 'USER',
    ADMIN = "ADMIN"
}
export enum AuthProviders {
    EMAIL = "EMAIL",
    FACEBOOK = "FACEBOOK",
    GOOGLE = 'GOOGLE'
}
export enum ACCOUNT_STATUS_ENUM {
    ACTIVATED = "ACTIVATED",
    DEACTIVATED = "DEACTIVATED"
}
export interface IUser {
    username: string
    fullName: string
    phoneNumber: string
    email: string,
    password: string
    country: string
    city: string
    zip_code: string
    state: string
    role: RoleEnum[]
    provider: AuthProviders
    resetToken: string
    otp?: string
    otp_expiry_time?: Date
    varified: boolean
    profile_image: string
    account_status: ACCOUNT_STATUS_ENUM
}

const userModel = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    zip_code: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    role: {
        type: [String],
        default: [RoleEnum.USER],
        enum: RoleEnum
    },
    provider: {
        type: String,
        default: AuthProviders.EMAIL
    },
    resetToken: {
        type: String,
        default: ""
    },
    otp: String,
    otp_expiry_time: Date,
    varified: {
        type: Boolean,
        default: false
    },
    profile_image: {
        type: String,
        default: ""
    },
    // ADMIN ACTIONS FOR ACTIVATING AND DEACTIVATE ACCOUNTS
    account_status: {
        type: String,
        enum: ACCOUNT_STATUS_ENUM,
        default: ACCOUNT_STATUS_ENUM.ACTIVATED
    },
}, {
    timestamps: true
})

const User = mongoose.model<IUser>("User", userModel)
export default User
