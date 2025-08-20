const express = require('express');
const router = express.Router();
const Transfer = require('../models/transferModel');

/**
 * @swagger
 * /transfer:
 *   get:
 *     summary: Get paginated list of USDT Transfer events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalTransfers:
 *                   type: integer
 *                 transfers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       from:
 *                         type: string
 *                       to:
 *                         type: string
 *                       value:
 *                         type: string
 *                       blockNumber:
 *                         type: integer
 *                       transactionHash:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */

router.get('/transfer', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const transfers = await Transfer.find()
            .sort({ blockNumber: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Transfer.countDocuments();

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalTransfers: total,
            transfers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
