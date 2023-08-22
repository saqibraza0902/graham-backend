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
    process_status: [
        {
            date: {
                type: Date,
                required: [true, "Process status date is required."]
            },
            status: {
                type: String,
                enum: ORDER_PROCESS_STATUS_ENUM,
                required: [true, "Process status is required."]
            }
        }
    ],
    billing_details: {
        username: String,
        name: String,
        email: String,
        mobile_number: String,
        city: String,
        zip_code: String,
        state: String,
        country: String,
    }
}, {
    timestamps: true
});
const Order = mongoose.model("Orders", orderSchema);
export default Order;
//# sourceMappingURL=Order.js.map