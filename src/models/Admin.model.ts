import mongoose from "mongoose"
export enum ADMIN_TYPES {
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export interface IAdmin {
    email: string
    password: string
    role: ADMIN_TYPES[]
}

const adminSchema = new mongoose.Schema<IAdmin>({
    email: String,
    password: String,
    role: {
        type: [String],
        default: [ADMIN_TYPES.ADMIN]
    }
}, {
    timestamps: true
})

const Admin = mongoose.model("admins", adminSchema)

export default Admin;