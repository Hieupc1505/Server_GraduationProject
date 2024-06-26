const httpStatus = require('http-status')
const createError = require('http-errors')
const tokenService = require('./token.service')
const userService = require('./user.service')
const ApiError = require('../../utils/api-error')

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserIsActivate(email)

    if (!user || !(await user.isPasswordMatch(password)))
        throw new createError(httpStatus.UNAUTHORIZED, 'Incorrect email or password!')

    return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<boolean>}
 */
const logout = async (cookies) => {
    if (!cookies) throw new createError(httpStatus.BAD_REQUEST, 'Bad Request')
    const refreshTokenDoc = await tokenService.verifyRefreshToken(cookies._cookie)
    if (!refreshTokenDoc) return new createError(httpStatus.BAD_REQUEST, 'Bad request')
    await tokenService.clearRefreshToken(refreshTokenDoc.sub)
    return true
}

/**
 *
 *
 */
const verifyEmail = async (token) => {
    const { sub } = await tokenService.verifyAccessToken(token)
    const verifyFail = await userService.verifyEmailByUserId(sub)
    if (verifyFail) throw new ApiError(httpStatus.BAD_REQUEST, `Email didn't register!!`)
}

const refreshAuth = async (token) => {
    const { sub } = await tokenService.verifyRefreshToken(token)

    const tokens = await tokenService.generateAuthTokens(sub)

    return tokens
}
module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    verifyEmail,
    refreshAuth,
}
