import mongoose, { Types } from "mongoose";
export interface ILikedProduct {
    add_id: Types.ObjectId
    user_id: Types.ObjectId
}
const likedProductSchema = new mongoose.Schema<ILikedProduct>({
    add_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Add"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const LikedProduct = mongoose.model("LikedProduct", likedProductSchema)
export default LikedProduct