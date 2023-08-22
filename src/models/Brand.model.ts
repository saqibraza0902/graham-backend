import mongoose from "mongoose";


interface IBrand {
    name: string
    draft: boolean
}
const brandSchema = new mongoose.Schema<IBrand>({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true
    },
    draft: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Brand = mongoose.model<IBrand>("Brand", brandSchema)

export default Brand; 