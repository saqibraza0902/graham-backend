import Add from "../../models/Add.model.js";
import Invoice from "../../models/Invoice.js";
import Order from "../../models/Order.js";
import Payout from "../../models/Payout.js";
import TempOrders from "../../models/TempOrder.model.js";
import { PAYMENT_STATUS_ENUM } from "../../utils/enums.js";
import { stripe } from "../stripe.js";

export const verify_order_webhook = async (id: string) => {
    console.log("***invioce id***", id)
    try {
        let invoice = await Invoice.findById(id)
        if (!invoice || !invoice?.stripe_session_id) {
            console.log('step 1')
            return false;
        }
        let totalPayouts = 0
        // 
        for (let index = 0; index < invoice.items.length; index++) {
            try {
                const tempOrder = await TempOrders.findById(invoice.items[index])
                if (tempOrder) {
                    const { ...rest } = tempOrder
                    // @ts-ignore
                    const { _id, ...order_to_create } = rest._doc
                    const newOrder = await Order.create(order_to_create)
                    invoice.items[index] = newOrder._id
                }
            } catch (error) {
                console.log('step 2--->', error.message)
                return false;
            }
        }
        for (let index = 0; index < invoice.items.length; index++) {
            // UPDATE THE ORDER STATUS TO PAID.
            const dbOrder = await Order.findByIdAndUpdate(invoice.items[index], {
                $set: {
                    payment_status: PAYMENT_STATUS_ENUM.PAID,
                    stripe_session_id: invoice.stripe_session_id
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
        return true
    } catch (error: any) {
        console.log('end', error.message)
        return false
    }
}