import mongoose from "mongoose";
export enum SubscriptionNameEnum {
    TOP_PLAN = "TOP_PLAN",
    HIGH_LIGHT_PLAN = "HIGH_LIGHT_PLAN",
    PUSH_UP_PLAN = "PUSH_UP_PLAN"
}
export interface ISubscription {
    name: SubscriptionNameEnum
    duration_in_days: number
    draft: boolean
    amount: number
}
const subscriptionSchema = new mongoose.Schema<ISubscription>({
    name: {
        type: String,
        enum: SubscriptionNameEnum,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    draft: {
        type: Boolean,
        default: false
    },
    duration_in_days: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema)

export default Subscription