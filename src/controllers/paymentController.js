const Payment = require('../models/paymentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const redis = require('../config/redis');

// Cache invalidation
const invalidatePaymentsCache = async () => {
  await redis.del("payments:all");
  const keys = await redis.keys("payments:page:*");
  if (keys.length) await redis.del(keys);
};

// Create Stripe Checkout session (existing)
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
    await invalidatePaymentsCache(); // invalidate after creation

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Payment' }, unit_amount: amount * 100 }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      client_reference_id: payment._id.toString(),
    });

    res.status(200).json({ id: session.id, url: session.url, paymentId: payment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get payment status (existing)
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ status: payment.status, amount: payment.amount, transactionId: payment.transactionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all payments with caching
exports.getAllPayments = async (req, res, next) => {
  try {
    const cacheKey = "payments:all";
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const payments = await Payment.find();
    await redis.set(cacheKey, JSON.stringify(payments), "EX", 300);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Paginated payments with caching
exports.getPaymentsPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const cacheKey = `payments:page:${page}:limit:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const payments = await Payment.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    await redis.set(cacheKey, JSON.stringify(payments), "EX", 300);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};
