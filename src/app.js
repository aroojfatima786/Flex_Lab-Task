const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const connectRedis = require('connect-redis'); 
const redis = require('./config/redis'); // already a connected ioredis client

const webhookRoutes = require('./routes/webhookRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transferRoutes = require('./routes/transferRoutes');
const { startTransferListener } = require('./controllers/transferController');
const swaggerDocs = require('./swagger');

const app = express();
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true, 
      maxAge: 1000 * 60 * 30 // 30 mins
    },
  })
);


app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api/stripe/webhook')) {
    console.log(`${req.method} ${req.originalUrl} - body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/api', transferRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', paymentRoutes);

startTransferListener();

swaggerDocs(app);

app.get('/api/test', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
