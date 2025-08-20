require('dotenv').config();
const { ethers } = require('ethers');
const Transfer = require('../models/transferModel');
const { providerUrl, USDT_ADDRESS, ERC20_ABI } = require('../config/eth');

const provider = new ethers.JsonRpcProvider(providerUrl);

const startTransferListener = async () => {
  if (global.transferListenerStarted) {
    console.log('Transfer listener already running...');
    return;
  }
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
      {
        $setOnInsert: {
          from,
          to,
          value: value.toString(),
          blockNumber: blockNum,
          transactionHash: txHash
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`New Transfer Saved - From: ${from} To: ${to} Value: ${value.toString()} Block: ${blockNum} Tx: ${txHash}`);
    }
  } catch (err) {
    console.error('Error saving transfer:', err);
  }
});

};

module.exports = {
  startTransferListener
};
