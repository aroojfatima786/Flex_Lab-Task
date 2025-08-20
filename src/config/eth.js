require('dotenv').config();

module.exports = {
  providerUrl: process.env.INFURA_RPC_URL,
  USDT_ADDRESS: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ERC20_ABI: [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ]
};
