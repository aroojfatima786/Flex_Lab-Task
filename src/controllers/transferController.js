const Transfer = require('../models/transferModel');
const redis = require('../config/redis');

const invalidateTransfersCache = async () => {
  await redis.del("transfers:all");
  const keys = await redis.keys("transfers:page:*");
  if (keys.length) await redis.del(keys);
};

const { ethers } = require('ethers');
const { providerUrl, USDT_ADDRESS, ERC20_ABI } = require('../config/eth');
const provider = new ethers.JsonRpcProvider(providerUrl);

const startTransferListener = async () => {
  if (global.transferListenerStarted) return;
  global.transferListenerStarted = true;

  const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);
  console.log('Listening to USDT Transfer events...');

  let lastSavedBlock = 0;
  try {
    const lastTransfer = await Transfer.findOne().sort({ blockNumber: -1 });
    lastSavedBlock = lastTransfer?.blockNumber || 0;
  } catch (err) {
    console.error('Error fetching last saved block:', err);
  }

  contract.on('Transfer', async (from, to, value, event) => {
    try {
      const txHash = event?.transactionHash || event?.log?.transactionHash;
      const blockNum = event?.blockNumber || event?.log?.blockNumber;
      if (!txHash || !blockNum) return;

      const result = await Transfer.updateOne(
        { transactionHash: txHash },
        { $setOnInsert: { from, to, value: value.toString(), blockNumber: blockNum, transactionHash: txHash } },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`New Transfer Saved - From: ${from} To: ${to} Value: ${value.toString()} Block: ${blockNum} Tx: ${txHash}`);
        await invalidateTransfersCache(); // invalidate cache on new transfer
      }
    } catch (err) {
      console.error('Error saving transfer:', err);
    }
  });
};
const getTransfersPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const cacheKey = `transfers:page:${page}:limit:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const transfers = await Transfer.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    await redis.set(cacheKey, JSON.stringify(transfers), "EX", 300);
    res.json(transfers);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startTransferListener,
  getTransfersPaginated,
  invalidateTransfersCache
};
