import mongoose from "mongoose";
const payoutSchema = new mongoose.Schema({
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
});
const Payout = mongoose.model("Payouts", payoutSchema);
export default Payout;
//# sourceMappingURL=Payout.js.map