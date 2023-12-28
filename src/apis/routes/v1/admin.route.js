const express = require('express')

const { adminController } = require('../../controllers')
const { authValidation } = require('../../validations')

const validate = require('../../../middlewares/validate')

const router = express.Router()

router.get('/dashboard', adminController.getDashboard)

router.get('/administrators', adminController.administrators)
router.post('/administrators/filter', adminController.adminDetail)
router.get('/customers', adminController.customers)
router.post('/customers/filter', adminController.customerDetail)
router.get('/categories', adminController.getAllCategory)
router.post('/categories', adminController.getProductByCategory)

// router.get('/categories', authController.register)
router.get('/products', adminController.products)
router.post('/products/add/base64/single', adminController.uploadImageBase64Single)
router.post('/products/add/base64/multiple', adminController.uploadLoadBase64Multiple)

//
router.get('/orders', adminController.orders)
router.get('/orders/filter', adminController.orders)

module.exports = router
