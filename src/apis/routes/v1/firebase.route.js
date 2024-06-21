const express = require('express')
const router = express.Router()
const { firebaseCtrl } = require('../../controllers')

router.get('/login-with-google', firebaseCtrl.loginWithGoogle)

module.exports = router
