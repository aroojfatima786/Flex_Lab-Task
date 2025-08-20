const Payment = require('../models/paymentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handleWebhook = async (req, res) => {
  console.log('Webhook hit!');   
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const payment = await Payment.findById(session.client_reference_id);
    if (payment) {
      payment.status = 'succeeded';
      payment.transactionId = session.payment_intent || session.id;
      await payment.save();
      console.log('Payment updated to succeeded via checkout session:', payment._id);
    } else {
      console.log('Payment not found in DB!');
    }
  }
  
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const payment = await Payment.findOne({ transactionId: intent.id });
    if (payment) {
      payment.status = 'succeeded';
      await payment.save();
      console.log('Payment succeeded:', payment._id);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object;
    const payment = await Payment.findOne({ transactionId: intent.id });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
      console.log('Payment failed:', payment._id);
    }
  }
  res.json({ received: true });
};
