import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
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
});
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
//# sourceMappingURL=Brand.model.js.map