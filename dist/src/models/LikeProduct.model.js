import mongoose from "mongoose";
const likedProductSchema = new mongoose.Schema({
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
});
const LikedProduct = mongoose.model("LikedProduct", likedProductSchema);
export default LikedProduct;
//# sourceMappingURL=LikeProduct.model.js.map