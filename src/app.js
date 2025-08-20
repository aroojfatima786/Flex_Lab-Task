const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const webhookRoutes = require('./routes/webhookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transferRoutes = require('./routes/transferRoutes');
const { startTransferListener } = require('./controllers/transferController');


const swaggerDocs = require('./swagger');

const app = express();

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api/stripe/webhook')) {
    console.log(`${req.method} ${req.originalUrl} - body:`, req.body);
  }
  next();
});
app.use('/api', transferRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);
startTransferListener();
swaggerDocs(app);

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ ok: true });
});

module.exports = app;
