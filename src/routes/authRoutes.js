const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { signup, signin, profile, logout, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const signupValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character'),
    body('age').optional().isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('phonenumber').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const signinValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or Username is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];



const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/signup', signupValidation, validate, signup);
router.post('/signin', signinValidation, validate, signin);
router.get('/profile', protect, profile);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken); 

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: Pass@123
 *               age:
 *                 type: integer
 *                 example: 22
 *               phonenumber:
 *                 type: string
 *                 example: "+923001234567"
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *                 description: Only admin can assign role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User Login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: "Enter your **Email** or **Username** in the `identifier` field along with your password."
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: "Your registered **Email** or **Username**"
 *                 example: "textuser@example.com or username"
 *               password:
 *                 type: string
 *                 description: "Your account password"
 *                 example: "Pass@123"
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens
 *       401:
 *         description: Invalid credentials
 */


/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Refresh Token required
 *       403:
 *         description: Invalid Refresh Token
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user (clear cookie)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get own profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
