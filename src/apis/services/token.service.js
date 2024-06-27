const JWT = require('jsonwebtoken')
const moment = require('moment')
const status = require('http-status')
const { Token } = require('../models')
const ApiError = require('../../utils/api-error')
const createError = require('http-errors')
const env = require('../../configs/env')
const { tokenTypes } = require('../../configs/tokens')
const { getRedis } = require('../../loaders/redisLoader')
const { promisify } = require('util')
// const { instanceConnect: redisClient } = getRedis()

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    // const accessTokenExpires = moment().add(env.passport.jwtAccessExpired / 60, 'minutes')
    const accessToken = generateToken(user.id, env.passport.jwtAccessExpired * 60 * 1000, env.jwt.secretAccessToken)

    // const refreshTokenExpires = moment().add(env.passport.jwtRefreshExpired / 60, 'minutes')
    const refreshToken = generateToken(user.id, env.passport.jwtAccessExpired * 60 * 1000, env.jwt.secretRefreshToken)

    await saveRefreshToken(user.id, refreshToken, env.passport.jwtAccessExpired * 60 * 1000)

    return {
        access: accessToken,
        refresh: refreshToken,
    }
}

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expiresTime, secret = env.jwt.secretAccessToken) => {
    const payload = {
        sub: userId,
    }
    const options = {
        expiresIn: expiresTime,
    }

    return JWT.sign(payload, secret, options)
}

/**
 * Get a token by refresh token
 * @param {string} refreshToken
 * @param {boolean} isBlackListed
 * @returns {Promise<Token>}
 */
const getTokenByRefresh = async (refreshToken, isBlackListed) => {
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: isBlackListed,
    })
    return refreshTokenDoc
}
/**
 *
 * @param {string} userId
 * @param {string} token //jwt string
 * @param {number} expiresTime //minute
 * @returns {Promise<token>}
 */

const saveRefreshToken = async (userId, token, expiresTime) => {
    const redisClient = getRedis()
    await redisClient.set(userId.toString(), token, 'EX', expiresTime)
    return true
}

const clearRefreshToken = async (userId) => {
    const redisClient = getRedis()

    return await redisClient.del(userId.toString(), (err, reply) => {
        if (err) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Internal server error:::${err}`)
        return reply
    })
}

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    })
    return tokenDoc
}
/**
 *
 * @param {string} token
 * @returns {Promise<tokenInfo>}
 */

const verifyAccessToken = async (token) => {
    const verifyAsync = promisify(JWT.verify) // Convert jwt.verify to a promise-based function

    return await verifyAsync(token, env.jwt.secretAccessToken)
}

/**
 *
 * @param {string} refreshToken
 * @returns {Promise<payload>}
 */
const verifyRefreshToken = async (refreshToken) => {
    const redisClient = getRedis()
    const verifyAsync = promisify(JWT.verify)

    const payload = await verifyAsync(refreshToken, env.jwt.secretRefreshToken)
    if (!payload) return new createError(400, 'Bad request')
    const result = await redisClient.get(payload.sub)
    if (result && refreshToken === result) return payload

    return null
}

module.exports = {
    generateAuthTokens,
    generateToken,
    getTokenByRefresh,
    verifyAccessToken,
    verifyRefreshToken,
    clearRefreshToken,
}
