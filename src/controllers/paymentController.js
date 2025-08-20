const Payment = require('../models/paymentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.createCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body;

    const payment = new Payment({
      userId: req.user._id,
      amount,
      status: 'pending',
      transactionId: null, 
    });

    await payment.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Payment' },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      client_reference_id: payment._id.toString(),
    });

    res.status(200).json({
      id: session.id,
      url: session.url,
      paymentId: payment._id,
    });

    console.log('Checkout session created:', session.id, 'for Payment ID:', payment._id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.status(200).json({
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
