import mongoose from "mongoose";
const taxSchema = new mongoose.Schema({
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
});
const Tax = mongoose.model("Tax", taxSchema);
export default Tax;
//# sourceMappingURL=Tax.model.js.map