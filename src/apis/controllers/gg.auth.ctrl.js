const status = require('http-status')

const catchAsync = require('../../utils/catch-async')
const { authService, tokenService, userService, emailService } = require('../services')
const env = require('../../configs/env')
const { authToken } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const { authValidation } = require('../validations')
const ApiError = require('../../utils/api-error')

const login = catchAsync(async (req, res) => {
    if (!req.user) throw new ApiError(status.UNAUTHORIZED, 'UNAUTHORIZED')
    const { _json } = req.user
    const user = await userService.createUserByGoggle({
        email: _json.email,
        provider: 'gg',
        userInfo: {
            displayName: _json.name,
        },
    })
    const { access, refresh } = await tokenService.generateAuthTokens(user)
    res.cookie('_cookie', refresh, {
        httpOnly: true,
        maxAge: refresh.expires,
    })

    res.status(status.OK).json({
        success: true,
        element: {
            user,
            tokens: access,
        },
        message: null,
        meta: null,
    })
})

const loginFirebaseGoogle = catchAsync(async (req, res) => {
    const { email, displayName } = req.body

    if (!email || !displayName) throw new ApiError(status.UNAUTHORIZED, 'UNAUTHORIZED')

    let user = await userService.getUserByEmail(email)
    if (!user) {
        user = await userService.createUserByGoggle({
            email,
            provider: 'gg',
            userInfo: {
                displayName,
            },
        })
    }

    const { access, refresh } = await tokenService.generateAuthTokens(user)
    res.cookie('_cookie', refresh, {
        httpOnly: true,
        maxAge: refresh.expires,
    })

    res.status(status.OK).json({
        success: true,
        element: {
            tokens: access,
        },
        message: null,
        meta: null,
    })
})

module.exports = {
    login,
    loginFirebaseGoogle,
}
