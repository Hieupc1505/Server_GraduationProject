const httpStatus = require('http-status')

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
    const user = await userService.getUserByEmail(email)
    if (!user?.isEmailVerified) throw new ApiError(httpStatus.UNAUTHORIZED, 'Email is not activate!!')
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    }
    return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<boolean>}
 */
const logout = async (cookies) => {
    if (!cookies) throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request')
    const refreshTokenDoc = await tokenService.verifyRefreshToken(cookies._cookie)

    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
    }

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

const addUserLoginByGoogle = async (email) => {
    if (!(await userService.getUserByEmail(email))) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
}

module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    verifyEmail,
    refreshAuth,
}
