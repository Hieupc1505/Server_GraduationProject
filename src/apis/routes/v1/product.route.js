const express = require('express')

const router = express.Router()

const { productCtrl } = require('../../controllers')

router.get('/liked', productCtrl.listLiked)

router.get('/init', productCtrl.initProduct)
router.get('/search', productCtrl.searchAndFilterProduct)
router.get('/list/latest', productCtrl.getProductByLatest)
router.get('/list/selled', productCtrl.getListBySelled)
router.get('/:id', productCtrl.getProductById)

router.post('/add', productCtrl.addProduct)
router.post('/full', productCtrl.adminGetProduct)
router.post('/edit', productCtrl.editProduct)
router.post('/delete', productCtrl.deleteProduct)

router.post('/like', productCtrl.addLikeProduct)

module.exports = router
