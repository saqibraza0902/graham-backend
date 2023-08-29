import express from 'express';
import { stripe } from '../../lib/stripe.js';
import { WEB_HOOKS_ENUM } from '../../utils/enums.js';
import { verify_order_webhook } from '../../lib/stripe_functions/verify_order_webhook.js';
import { verify_plan_checkout_session } from '../../lib/stripe_functions/create_plan_chekcout_session.js';

const router = express.Router();

let endpointSecret;
endpointSecret = 'whsec_pQXqoveXkU8T9viGWUrxDIGjo98kVCEK';

router.post(
  '/create-plan',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let data;
    let eventType;
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('web hook verified--------------->');
    } catch (err) {
      console.log('web hook error------------>', err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
    console.log('DATA------------->', JSON.stringify(data));
    console.log('EVENT_TYPE-==>', eventType);
    switch (eventType) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        // CART CHECKOUT
        if (
          checkoutSessionCompleted?.metadata?.web_hook ===
          WEB_HOOKS_ENUM.ORDER_CHECKOUT_WEBHOOK
        ) {
          const result = await verify_order_webhook(
            checkoutSessionCompleted?.metadata?.invoice_id
          );
          if (result) {
            console.info('***Order checkout successful***');
          } else {
            console.error('***Order checkout failed***');
          }
        }
        // CREATE ADD WITH PLAN
        if (
          checkoutSessionCompleted?.metadata?.web_hook ===
          WEB_HOOKS_ENUM.PLAN_CHECKOUT_WEBHOOK
        ) {
          const result = await verify_plan_checkout_session(
            checkoutSessionCompleted?.metadata?.temp_add_id
          );
          if (result) {
            console.info('***Plan payment successful***');
          } else {
            console.error('***Plan payment failed***');
          }
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);

export default router;
