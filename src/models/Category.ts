import mongoose, { Types } from "mongoose";

export interface ICategory {
    name: string
    parent_category?: Types.ObjectId
    draft: boolean
    icon?: string
}
const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    parent_category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        default: null
    },
    draft: {
        type: Boolean,
        default: false
    },
    icon: String
}, {
    timestamps: true,
})

const Category = mongoose.model<ICategory>("Category", categorySchema)

export default Category