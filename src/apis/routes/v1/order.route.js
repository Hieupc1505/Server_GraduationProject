const express = require('express')

const { orderCtrl } = require('../../controllers')

const router = express.Router()

router.post('/add', orderCtrl.addOrder)
router.post('/banking', orderCtrl.bankOrder)
router.get('/payment_return/:keyCode', orderCtrl.bankReturn)
router.get('/ordered', orderCtrl.getOrders)
router.post('/update', orderCtrl.updateStatusOrder)
router.post('/detail', orderCtrl.getDetailOrder)

module.exports = router
