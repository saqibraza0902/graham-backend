import mongoose, { Types } from "mongoose";
import { ORDER_PROCESS_STATUS_ENUM, ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM } from "../utils/enums.js";

type TOrderProcessStatus = {
    date: Date
    status: ORDER_PROCESS_STATUS_ENUM
}
export type Billing_Details = {
    username: string
    name: string
    email: string
    mobile_number: string
    city: string
    zip_code: string
    state: string
    country: string
}
export interface IOrder {
    product: Types.ObjectId
    quantity: number
    total_price: number
    buyer: Types.ObjectId
    seller: Types.ObjectId
    seller_earned: number
    start_date: Date
    end_date: Date
    time_difference: number
    taxes: number
    service_fee: number
    process_status: [TOrderProcessStatus]
    payment_status: PAYMENT_STATUS_ENUM
    order_status: ORDER_STATUS_ENUM
    billing_details: Billing_Details
}

const orderSchema = new mongoose.Schema<IOrder>({
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
})

const Order = mongoose.model<IOrder>("Orders", orderSchema)

export default Order;