import * as Yup from 'yup'


export const adminAuthLoginValidation = Yup.object({
    email: Yup.string().required("Email is required.").email("Invalid email."),
    password:Yup.string().required("Password is required.")
})