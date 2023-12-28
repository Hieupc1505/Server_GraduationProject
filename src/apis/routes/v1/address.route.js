const express = require('express')
const router = express.Router()
const addressCtrl = require('../../controllers/address.controller')

router.get('/init/level1', addressCtrl.addLevel1)
router.get('/p', addressCtrl.getProvince)
router.get('/:province/d', addressCtrl.getDistricts)
router.get('/:province/:districts/w', addressCtrl.getWards)
module.exports = router
