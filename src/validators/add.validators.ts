import * as Yup from 'yup'
import { ADD_TYPE, RENTED_AS_ENUM } from '../models/Add.model.js'
import { ORDER_PROCESS_STATUS_ENUM } from '../utils/enums.js'


export const createAddValidator = Yup.object({
    add_title: Yup.string().required("Add title is required."),
    add_description: Yup.string().required("Add description is required."),
    available_stock: Yup.number().min(1, "Stock is required.").required("Stock is required."),
    images: Yup.array().of(Yup.string()).required("Images are required."),
    prices: Yup.object({
        currency: Yup.string().required("Currency is required."),
        rented_as: Yup.string().required("Rated as is required.").oneOf(Object.keys(RENTED_AS_ENUM)),
        rent_price: Yup.number().min(1, "Rent price is required.").required("Rent price is required."),
        taxes: Yup.number(),
        service_fee: Yup.number(),
    }),
    category: Yup.string().required("Category is required"),
    vendor_details: Yup.object({
        name: Yup.string().required("Vendor name is required."),
        street_no_1: Yup.string().required("Vendor street no.1 is required."),
        street_no_2: Yup.string().required("Vendor street no.2 is required."),
        phone_number: Yup.string().required("Vendor phone number required."),
        desctiption: Yup.string().required("Vendor desctiption is required."),
        postcode: Yup.string().required("Vendor postcode is required."),
        city: Yup.string().required("Vendor city is required."),
        country: Yup.string().required("Vendor country is required."),
    }),
    sub_category: Yup.string().required("Sub category is required"),
    brand: Yup.string().required("Brand is required"),
    payment_policy: Yup.object({
        deposit: Yup.boolean().required("Policy deposit is required."),
        rent_type: Yup.string().required("Rent type is required."),
        amount: Yup.number().min(1, "Amount is required.").required("Amount is required."),
    }),
    product_details: Yup.string().required("Product details is required."),
    about_product: Yup.string().required("About product is required."),
    things_to_know: Yup.string().required("Things to know is required."),
    cancellation_policy: Yup.string().required("Cancellation policy is required."),
    customDetails: Yup.array().of(
        Yup.object({
            label: Yup.string(),
            value: Yup.string(),
        })
    ),
    location: Yup.object({
        street_no_1: Yup.string().required("Street is required."),
        street_no_2: Yup.string().required("Street is required."),
        postcode: Yup.string().required("Postcode is required."),
        city: Yup.string().required("City is required."),
        country: Yup.string().required("Country is required."),
        lat: Yup.number().required("Latitude is required."),
        long: Yup.number().required("Longitude is required."),
    }),
    plan: Yup.object({
        amount: Yup.number(),
        duration_in_days: Yup.number(),
        name: Yup.string()
    })
})


export const getUserPostsWithPaginationValidator = Yup.object({
    userId: Yup.string().required("User Id is required.")
})

export const changeAddStatusValidator = Yup.object({
    status: Yup.boolean().required("Status is required.")
})


export const change_order_process_status_validator = Yup.object({
    order_id: Yup.string().required("Order ID is required"),
    process_status: Yup.string().oneOf(Object.values(ORDER_PROCESS_STATUS_ENUM)).required("Process status is required")
})