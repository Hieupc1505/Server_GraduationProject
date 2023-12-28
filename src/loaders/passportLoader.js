const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { jwtStrategy } = require('../apis/plugins/passport')

const env = require('../configs/env')

module.exports = (app) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: env.passport.clientId,
                clientSecret: env.passport.clientSecret,
                callbackURL: '/api/v1/gg/google/callback',
                scope: ['profile', 'email'],
            },
            function (accessToken, refreshToken, profile, callback) {
                callback(null, profile)
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}
