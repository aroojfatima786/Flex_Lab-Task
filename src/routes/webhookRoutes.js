const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');
const router = express.Router();

router.post('/', handleWebhook);

module.exports = router;
