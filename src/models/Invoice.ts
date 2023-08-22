import mongoose, { Types } from "mongoose";

interface IInvoice {
    items: [Types.ObjectId]
    user: Types.ObjectId
    stripe_session_id: string
}


const invoiceSchema = new mongoose.Schema<IInvoice>({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
    stripe_session_id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
})

const Invoice = mongoose.model<IInvoice>("Invoices", invoiceSchema)
export default Invoice;