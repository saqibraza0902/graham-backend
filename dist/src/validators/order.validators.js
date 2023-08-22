import * as Yup from 'yup';
export const createOrderValidator = Yup.object({
    items: Yup.array().of(Yup.object({
        product: Yup.string().required("Product id is required."),
        quantity: Yup.number().required("Product quantity is required."),
        total_price: Yup.number().required("Total price is required."),
        start_date: Yup.string().required("Start date is required."),
        end_date: Yup.string().required("End date is required."),
        time_difference: Yup.number().required("Time difference is required."),
        taxes: Yup.number().required("Taxes are required."),
        service_fee: Yup.number().required("Service fee is required."),
        seller: Yup.string().required("Seller is required."),
    })),
    billing_details: Yup.object({
        username: Yup.string().required("User name is required."),
        name: Yup.string().required("Name is required."),
        email: Yup.string().required("Email is required."),
        mobile_number: Yup.string().required("Mobile number is required."),
        city: Yup.string().required("City is required."),
        zip_code: Yup.string().required("Zip code is required."),
        state: Yup.string().required("State is required."),
        country: Yup.string().required("Country is required."),
    })
});
//# sourceMappingURL=order.validators.js.map