const passport = require('passport')
const env = require('../../configs/env')

exports.loginSuccess = (req, res) => {
    // Your login success logic here
}

exports.loginFailed = (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    })
}

exports.authenticateGoogle = passport.authenticate('google', ['profile', 'email'])

exports.googleCallback = passport.authenticate('google', {
    successRedirect: env.client.redirect_gg_verify,
    failureRedirect: '/login/failed',
})

exports.logout = (req, res) => {
    req.logout()
    res.redirect(env.client.url)
}
