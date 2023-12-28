const express = require('express')
const { authController } = require('../../controllers')

const router = express.Router()

router.post('/delete', authController.deleteAccount)
router.post('/update', authController.updateInfo)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
