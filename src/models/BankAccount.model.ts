import mongoose, { Types } from "mongoose"

export interface IBankAccount {
    account_id: string
    user: Types.ObjectId
    verified: boolean
}

const bankAccountSchema = new mongoose.Schema<IBankAccount>({
    account_id: {
        type: String,
        required: [true, 'Account id is required.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User is required.']
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const BankAccount = mongoose.model("bankaccounts", bankAccountSchema)
export default BankAccount