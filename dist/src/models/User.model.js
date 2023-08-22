import mongoose from "mongoose";
export var RoleEnum;
(function (RoleEnum) {
    RoleEnum["USER"] = "USER";
    RoleEnum["ADMIN"] = "ADMIN";
})(RoleEnum || (RoleEnum = {}));
export var AuthProviders;
(function (AuthProviders) {
    AuthProviders["EMAIL"] = "EMAIL";
    AuthProviders["FACEBOOK"] = "FACEBOOK";
    AuthProviders["GOOGLE"] = "GOOGLE";
})(AuthProviders || (AuthProviders = {}));
export var ACCOUNT_STATUS_ENUM;
(function (ACCOUNT_STATUS_ENUM) {
    ACCOUNT_STATUS_ENUM["ACTIVATED"] = "ACTIVATED";
    ACCOUNT_STATUS_ENUM["DEACTIVATED"] = "DEACTIVATED";
})(ACCOUNT_STATUS_ENUM || (ACCOUNT_STATUS_ENUM = {}));
const userModel = new mongoose.Schema({
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
    }
}, {
    timestamps: true
});
const User = mongoose.model("User", userModel);
export default User;
//# sourceMappingURL=User.model.js.map