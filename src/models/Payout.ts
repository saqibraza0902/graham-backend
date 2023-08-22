import mongoose, { Types } from "mongoose";

interface IPayout {
    user: Types.ObjectId
    amount: number
}

const payoutSchema = new mongoose.Schema<IPayout>({
    amount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})
const Payout = mongoose.model<IPayout>("Payouts", payoutSchema)
export default Payout;