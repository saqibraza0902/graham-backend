import mongoose, { Schema, Types } from 'mongoose'
export enum ADD_TYPE {
    I_OFFER = "I_OFFER",
    I_LOOKING_FOR = "I_LOOKING_FOR"
}
export enum RENTED_AS_ENUM {
    HOUR = 'HOUR',
    DAY = "DAY",
    WEEKS = 'WEEKS',
    MONTH = "MONTH",
    YEAR = 'YEAR'
}
type Price = {
    currency: string
    rented_as: RENTED_AS_ENUM
    rent_price: number
    taxes: number
    service_fee: number
}
type PaymentPolicy = {
    deposit: boolean
    rent_type: string
    amount: number
}
type CustomDetails = {
    label: string
    value: string
}
enum LocationTypeEnum {
    Point = "Point"
}
type Location = {
    type: LocationTypeEnum
    coordinates: number[]
    street_no_1: string
    street_no_2: string
    postcode: string
    city: string
    country: string
    lat: number
    long: number
}
type Plan = {
    amount: number,
    duration_in_days: number,
    name: string
}
type VendorDetails = {
    name: string
    street_no_1: string
    street_no_2: string
    phone_number: string
    desctiption: string
    postcode: string
    city: string
    country: string
}
export interface IAdd {
    add_title: string
    add_description: string
    available_stock: number
    images: string[]
    prices: Price
    vendor_details: VendorDetails
    category: string
    sub_category: string
    brand: string
    payment_policy: PaymentPolicy
    product_details: string
    about_product: string
    things_to_know: string
    cancellation_policy: string
    customDetails: CustomDetails[]
    location: Location,
    start_date: Date,
    end_date: Date,
    plan: Plan
    created_by: Types.ObjectId
    disabled: boolean
}
const addSchema = new mongoose.Schema<IAdd>({
    add_title: String,
    add_description: String,
    available_stock: Number,
    images: [String],
    prices: {
        currency: String,
        rented_as: {
            type: String,
            enum: RENTED_AS_ENUM
        },
        rent_price: Number,
        taxes: Number,
        service_fee: Number
    },
    vendor_details: {
        name: String,
        street_no_1: String,
        street_no_2: String,
        phone_number: String,
        desctiption: String,
        postcode: String,
        city: String,
        country: String,
    },
    category: String,
    sub_category: String,
    brand: String,
    payment_policy: {
        deposit: Boolean,
        rent_type: String,
        amount: Number
    },
    product_details: String,
    about_product: String,
    things_to_know: String,
    cancellation_policy: String,
    customDetails: [{
        label: String,
        value: String
    }],
    location: {
        type: {
            type: String,
            enum: LocationTypeEnum,
            default: LocationTypeEnum.Point
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
        street_no_1: String,
        street_no_2: String,
        postcode: String,
        city: String,
        country: String,
        lat: Number,
        long: Number,
    },
    start_date: Date,
    end_date: Date,
    plan: {
        amount: Number,
        duration_in_days: Number,
        name: String
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

addSchema.index({ location: "2dsphere" })
const Add = mongoose.model<IAdd>("Add", addSchema)
export default Add