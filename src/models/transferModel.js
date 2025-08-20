const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  transactionHash: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
