import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
    stripe_session_id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
});
const Invoice = mongoose.model("Invoices", invoiceSchema);
export default Invoice;
//# sourceMappingURL=Invoice.js.map