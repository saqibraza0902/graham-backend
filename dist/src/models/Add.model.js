import mongoose from 'mongoose';
export var ADD_TYPE;
(function (ADD_TYPE) {
    ADD_TYPE["I_OFFER"] = "I_OFFER";
    ADD_TYPE["I_LOOKING_FOR"] = "I_LOOKING_FOR";
})(ADD_TYPE || (ADD_TYPE = {}));
export var RENTED_AS_ENUM;
(function (RENTED_AS_ENUM) {
    RENTED_AS_ENUM["HOUR"] = "HOUR";
    RENTED_AS_ENUM["DAY"] = "DAY";
    RENTED_AS_ENUM["WEEKS"] = "WEEKS";
    RENTED_AS_ENUM["MONTH"] = "MONTH";
    RENTED_AS_ENUM["YEAR"] = "YEAR";
})(RENTED_AS_ENUM || (RENTED_AS_ENUM = {}));
export var LocationTypeEnum;
(function (LocationTypeEnum) {
    LocationTypeEnum["Point"] = "Point";
})(LocationTypeEnum || (LocationTypeEnum = {}));
const addSchema = new mongoose.Schema({
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
});
addSchema.index({ location: "2dsphere" });
const Add = mongoose.model("Add", addSchema);
export default Add;
//# sourceMappingURL=Add.model.js.map