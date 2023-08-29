import Add from "../../models/Add.model.js";
import Order from "../../models/Order.js";
import { SubscriptionNameEnum } from "../../models/Subscription.model.js";
import TempAdd from "../../models/TempAdd.model.js";
import TempOrder from "../../models/TempOrder.model.js";
import { WEB_HOOKS_ENUM } from "../../utils/enums.js";
import { euroIntoCents, stripe } from "../stripe.js";

export const create_plan_checkout_session = async (amount: number, plan: SubscriptionNameEnum, temp_add_id: string): Promise<string | null> => {
    try {
        const stripeProduct = await stripe.products.create({
            name: `${plan}`
        });
        // Stripe-Price
        const stripePrice = await stripe.prices.create({
            unit_amount: euroIntoCents(amount),
            currency: "eur",
            product: stripeProduct.id,
        });
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: `${process.env.PLAN_SUCCESS}`,
            cancel_url: `${process.env.PLAN_CANCEL}`,
            mode: "payment",
            line_items: [{
                price: stripePrice.id,
                quantity: 1
            }],
            metadata: {
                // invoice id:
                temp_add_id: String(temp_add_id),
                web_hook: WEB_HOOKS_ENUM.PLAN_CHECKOUT_WEBHOOK
            },
        });
        return stripeSession.id
    } catch (error) {
        return null
    }
}


export const verify_plan_checkout_session = async (temp_add_id: string) => {
    try {
        const temp_add = await TempAdd.findById(temp_add_id)
        if (!temp_add) {
            console.log("*** temp_add not found ***")
            return false
        }
        const { ...rest } = temp_add
        // @ts-ignore
        const { _id, ...newOrderToCreate } = rest._doc
        await Add.create(newOrderToCreate)
        return true;
    } catch (error) {
        console.log("***Catch_block***", error.message)
        return false
    }
}