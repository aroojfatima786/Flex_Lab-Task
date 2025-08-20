const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { getAllUsers, getUserById, updateUser, deleteUser, profile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

router.get('/users', protect, checkRole('admin', 'moderator'), getAllUsers);
router.get('/users/:id', protect, getUserById);
router.delete('/users/:id', protect, checkRole('admin'), deleteUser);
router.patch('/users/:id', protect, upload.single('profileImage'), updateUser);

router.get('/profile', protect, profile);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User CRUD operations with role-based access
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied (only admin/moderator)
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched
 *       403:
 *         description: Access denied (if user tries to access another user's profile)
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Upload a profile image (jpeg, png, webp)
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Access denied
 */


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Access denied (only admin)
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Own user profile
 */
