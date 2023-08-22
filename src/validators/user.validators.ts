import * as Yup from 'yup'

export const registerVlidator = Yup.object({
    username: Yup.string().required("Username is required."),
    fullName: Yup.string().required("Full name is required."),
    password: Yup.string().required("Password is required.").min(8, 'Password length should atleast 8 characters.'),
    email: Yup.string().required("Email is required.").email("Invalid email."),
    phoneNumber: Yup.string().required("Phone number is required."),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    zip_code: Yup.string().required("zip_code is required"),
    state: Yup.string().required("State is required"),
})


export const loginValidator = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email."),
    password: Yup.string().required("Password is required.")
})

export const verifyOTPValidator = Yup.object({
    otp: Yup.string().required("Otp is required."),
    email: Yup.string().required("Email is required.").email("Invalid email."),
})

export const googleLoginValidation = Yup.object({
    email: Yup.string().required("Email is required.").email("Invalid email."),
    name: Yup.string()
})

export const facebookLoginValidation = Yup.object({
    email: Yup.string().required("Email is required.").email("Invalid email.")
})

export const changePasswordValidator = Yup.object({
    oldPassword: Yup.string().required("Old password is required."),
    newPassword: Yup.string().required("New password is required.")
})

export const updateUserProfileValidator = Yup.object({
    // username: Yup.string().required("Username is required."),
    fullName: Yup.string().required("Username is required."),
    // email: Yup.string().required("Email is required.").email("Invalid email."),
    phoneNumber: Yup.string().required("Phone number is required."),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    zip_code: Yup.string().required("Zip code is required"),
    state: Yup.string().required("State is required"),
})


export const updateProfileImageValidator = Yup.object({
    image: Yup.string().required("Image is required.")
})