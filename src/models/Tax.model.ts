import mongoose from "mongoose";
import { boolean } from "yup";
export interface ITax {
    name: string,
    percentage: number
    draft: boolean
}
const taxSchema = new mongoose.Schema<ITax>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    percentage: {
        type: Number,
        required: true,
    },
    draft: Boolean
}, {
    timestamps: true
})

const Tax = mongoose.model<ITax>("Tax", taxSchema)

export default Tax;