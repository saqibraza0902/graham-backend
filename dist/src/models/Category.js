import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
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
});
const Category = mongoose.model("Category", categorySchema);
export default Category;
//# sourceMappingURL=Category.js.map