import { Request, Response } from "express"
import { CreateResponse } from "../../utils/user/CreateResponse.js"
import { CreateOrder, createOrderValidator } from "../../validators/order.validators.js"
import Order, { Billing_Details, IOrder } from "../../models/Order.js"
import { Types } from "mongoose"
import { ORDER_PROCESS_STATUS_ENUM, ORDER_STATUS_ENUM, PAYMENT_STATUS_ENUM } from "../../utils/enums.js"
import Payout from "../../models/Payout.js"
import { euroIntoCents, stripe } from "../../lib/stripe.js"
import Stripe from "stripe"
import Add from "../../models/Add.model.js"
import Invoice from "../../models/Invoice.js"
const createSingleOrder = async (req: Request, item: CreateOrder['items'][0], billing_details: Billing_Details) => {
    try {
        const Obj: Partial<IOrder> = {
            buyer: req.user._id as unknown as Types.ObjectId,
            end_date: new Date(item.end_date),
            order_status: ORDER_STATUS_ENUM.PENDING,
            payment_status: PAYMENT_STATUS_ENUM.PENDING,
            process_status: [{ date: new Date(), status: ORDER_PROCESS_STATUS_ENUM.ORDERED }],
            product: item.product as unknown as Types.ObjectId,
            quantity: Number(item.quantity),
            seller: item.seller as unknown as Types.ObjectId,
            seller_earned: Number(item.total_price),
            service_fee: Number(item.service_fee),
            start_date: new Date(item.start_date),
            taxes: Number(item.taxes),
            time_difference: Number(item.time_difference),
            total_price: Number(item.total_price),
            billing_details: billing_details
        }
        const newOrder = await Order.create(Obj)
        return newOrder._id
    } catch (error) {
        return null
    }
}
const createCheckoutLineItem = async (item: CreateOrder['items'][0]): Promise<null | Stripe.Checkout.SessionCreateParams.LineItem> => {
    try {
        const dbProduct = await Add.findById(item.product)

        if (!dbProduct) {
            return null
        }
        // Stripe-Products
        const stripeProduct = await stripe.products.create({
            name: `${dbProduct.add_title}`,
            images: [dbProduct.images[0]],
        });
        // Stripe-Price
        const stripePrice = await stripe.prices.create({
            unit_amount: euroIntoCents(item.total_price),
            currency: "eur",
            product: stripeProduct.id,
        });
        return {
            price: stripePrice.id,
            quantity: item.quantity,
        }
    } catch (error) {
        return null

    }
}
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const body = await createOrderValidator.validate(req.body)

        const ordersIds = []
        for (const item of body.items) {
            // @ts-ignore
            const orderId = await createSingleOrder(req, item, body.billing_details)
            if (orderId) {
                ordersIds.push(orderId)
            }
        }
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
        for (const item of body.items) {
            const result = await createCheckoutLineItem(item)

            if (result) {
                lineItems.push(result)
            }
        }
        let _metaData = {}
        ordersIds.forEach((_id, index) => {
            _metaData[`${index}`] = _id
        })
        const newInvoice = await Invoice.create({
            items: ordersIds,
            user: req.user._id
        })
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            // payment_intent_data: {
            //     application_fee_amount: usdToCents(plateformfee),
            //     transfer_data: {
            //         destination: carUser.stripe_account_id!,
            //     },
            // },
            success_url: `${process.env.CHECKOUT_SUCCESS_URL}?invoice=${newInvoice._id}`,
            cancel_url: `${process.env.CHECKOUT_CANCEL_URL}?invoice=${newInvoice._id}`,
            mode: "payment",
            line_items: lineItems,
        });
        await Invoice.findByIdAndUpdate(newInvoice._id, {
            $set: {
                stripe_session_id: stripeSession.id
            }
        })
        return CreateResponse({ data: stripeSession.id, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}


export const verifyOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }
        const invoice = await Invoice.findById(id)
        if (!invoice || !invoice?.stripe_session_id) {
            return CreateResponse({ data: { msg: "Something went wrong try again later." }, res, statusCode: 400 })
        }
        const stripSession = await stripe.checkout.sessions.retrieve(
            invoice.stripe_session_id
        );
        if (stripSession.payment_status === "unpaid") {
            return res.status(400).json({ msg: "Payment was not successful try again later." });
        }
        let totalPayouts = 0
        for (let index = 0; index < invoice.items.length; index++) {
            // UPDATE THE ORDER STATUS TO PAID.
            const dbOrder = await Order.findByIdAndUpdate(invoice.items[index], {
                $set: {
                    payment_status: PAYMENT_STATUS_ENUM.PAID,
                }
            })
            // DECREMENT THE PRODUCT STOCK BY -1.
            await Add.findByIdAndUpdate(dbOrder.product, {
                $inc: {
                    available_stock: -Number(dbOrder.quantity)
                }
            })
            // CALCULATE THE NEW TOTAL PAYOUT FOR THE USER.
            if (dbOrder) {
                totalPayouts += Number(dbOrder.total_price)
            }
        }
        // REMOVE THE SESSION AS THE PAYMENT IS SUCCESSFUL.
        await Invoice.findByIdAndUpdate(invoice._id, {
            $set: {
                stripe_session_id: ""
            }
        })
        // ADD THE PAYOUT AMOUNT TO THE USER PAYMENT DOCUMENT.
        await Payout.findOneAndUpdate(
            { user: invoice.user },
            {
                $inc: {
                    amount: totalPayouts
                }
            },
            {
                upsert: true
            })
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}

export const handleCancelledOrderByStripe = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        }
        const invoice = await Invoice.findById(id)
        if (!invoice || !invoice?.stripe_session_id) {
            return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
        }
        const stripSession = await stripe.checkout.sessions.retrieve(
            invoice.stripe_session_id
        );
        if (stripSession.payment_status === "paid") {
            return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
        }
        await Order.deleteMany({ _id: { "$in": invoice.items } })
        return CreateResponse({ data: { msg: "success" }, res, statusCode: 200 })
    } catch (error: any) {
        return CreateResponse({ data: { msg: error.message }, res, statusCode: 500 })
    }
}