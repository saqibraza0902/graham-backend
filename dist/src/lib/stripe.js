import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
    typescript: true
});
export const calculatePlaterformFee = (price) => {
    return ((price * 2) / 100);
};
export const euroIntoCents = (price) => Math.round(Number(price.toFixed(2)) * 100);
export const centsIntoEuro = (price) => Math.round(Number(price.toFixed(2)) / 100);
//# sourceMappingURL=stripe.js.map