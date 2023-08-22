import * as Yup from 'yup'
import { SubscriptionNameEnum } from '../models/Subscription.model.js'


export const createSubscriptionValidator = Yup.object({
    name: Yup.string().oneOf(Object.keys(SubscriptionNameEnum)).required("Name is required."),
    duration_in_days: Yup.number().required("Duration is required."),
    draft: Yup.boolean().required("Status is required."),
    amount: Yup.number().required("Amount is required.")
})