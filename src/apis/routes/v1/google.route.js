const router = require('express').Router()
const passport = require('passport')
const env = require('../../../configs/env.js')

const { ggauthCtrl } = require('../../controllers')

router.get('/login/success', ggauthCtrl.login)

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    })
})

router.get('/google', passport.authenticate('google', ['profile', 'email']))

router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: env.client.redirect_gg_verify,
        failureRedirect: '/login/failed',
    })
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect(env.client.url)
})

module.exports = router
