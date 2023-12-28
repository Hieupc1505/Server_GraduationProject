const express = require('express')

const { authController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')

const router = express.Router()

router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/register', authController.register)
router.get('/info', authController.getUserInfo)

//hanle get/add/delet liked products
router.get('/liked', authController.getLikedProducts)
router.post('/liked/add', authController.addLikedProduct)
router.post('/liked/delete', authController.deleteLiked)

router.get('/activate/:token', authController.verifyEmail)
router.post('/user/update', authController.updateUserInfo)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
