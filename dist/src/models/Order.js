import mongoose from "mongoose";
import { ORDER_PROCESS_STATUS_ENUM, ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM } from "../utils/enums.js";
const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Add"
    },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Buyer is required.']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Seller is required.']
    },
    seller_earned: {
        type: Number,
        required: [true, 'Seller earnings is required.'],
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required.']
    },
    end_date: {
        type: Date,
        required: [true, 'End date is required.']
    },
    time_difference: {
        type: Number,
        required: [true, "Time difference is required."]
    },
    total_price: {
        type: Number,
        required: [true, 'Total price is required.']
    },
    service_fee: {
        type: Number,
        required: [true, 'Service fee is required.']
    },
    taxes: {
        type: Number,
        required: [true, 'Taxes is required.']
    },
    order_status: {
        type: String,
        enum: ORDER_STATUS_ENUM,
        required: [true, 'Order status is required.']
    },
    payment_status: {
        type: String,
        enum: PAYMENT_STATUS_ENUM,
    },
    process_status: {
        type: [
            {
                date: {
                    type: Date,
                },
                status: {
                    type: String,
                    enum: ORDER_PROCESS_STATUS_ENUM,
                }
            }
        ],
        default: [
            {
                date: new Date(),
                status: ORDER_PROCESS_STATUS_ENUM.ORDERED
            },
            {
                date: null,
                status: ORDER_PROCESS_STATUS_ENUM.DELIVERED
            },
            {
                date: null,
                status: ORDER_PROCESS_STATUS_ENUM.RETURNED
            },
        ]
    },
    billing_details: {
        username: String,
        name: String,
        email: String,
        mobile_number: String,
        city: String,
        zip_code: String,
        state: String,
        country: String,
    },
    refunded: {
        type: Boolean,
        default: false
    },
    stripe_session_id: {
        type: String,
        default: ""
    },
    refund_session_id: {
        type: String,
        default: ""
    },
    refunded_amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const Order = mongoose.model("Orders", orderSchema);
export default Order;
//# sourceMappingURL=Order.js.map