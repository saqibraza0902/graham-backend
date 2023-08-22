import mongoose from "mongoose";
export var SubscriptionNameEnum;
(function (SubscriptionNameEnum) {
    SubscriptionNameEnum["TOP_PLAN"] = "TOP_PLAN";
    SubscriptionNameEnum["HIGH_LIGHT_PLAN"] = "HIGH_LIGHT_PLAN";
    SubscriptionNameEnum["PUSH_UP_PLAN"] = "PUSH_UP_PLAN";
})(SubscriptionNameEnum || (SubscriptionNameEnum = {}));
const subscriptionSchema = new mongoose.Schema({
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
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
//# sourceMappingURL=Subscription.model.js.map