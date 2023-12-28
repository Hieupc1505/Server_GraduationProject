const express = require('express')
const router = express.Router()
const { cartCtrl } = require('../../controllers')

router.post('/add', cartCtrl.addToCart)
router.get('/all', cartCtrl.getAllCart)
router.post('/delete', cartCtrl.removeCart)
router.post('/update', cartCtrl.updateTypeProdcut)

module.exports = router
