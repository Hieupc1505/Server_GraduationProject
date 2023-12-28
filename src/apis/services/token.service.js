const JWT = require('jsonwebtoken')
const moment = require('moment')
const status = require('http-status')
const { Token } = require('../models')
const ApiError = require('../../utils/api-error')
const env = require('../../configs/env')
const { tokenTypes } = require('../../configs/tokens')
const client = require('../../loaders/redisLoader')

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
    return new Promise((res, rej) => {
        client.set(userId.toString(), token, 'EX', expiresTime, (err, reply) => {
            if (err) {
                return rej(new ApiError(status.INTERNAL_SERVER_ERROR, status[500]).orginalError(err))
            }
            res(true)
        })
    })
}

const clearRefreshToken = async (userId) => {
    return await client.del(userId.toString(), (err, reply) => {
        if (err) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
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
const verifyAccessToken = (token) => {
    return new Promise((res, rej) => {
        JWT.verify(token, env.jwt.secretAccessToken, (err, payload) => {
            if (err) {
                if (err.name === 'JosonWebTokenError') return rej(ApiError(status.UNAUTHORIZED, 'verify accesstoken'))
                return rej(new ApiError(status.INTERNAL_SERVER_ERROR, 'Internal Sever Error').orginalError(error))
            }
            res(payload)
        })
    })
}

/**
 *
 * @param {string} refreshToken
 * @returns {Promise<payload>}
 */
const verifyRefreshToken = async (refreshToken) => {
    return new Promise((res, rej) => {
        JWT.verify(refreshToken, env.jwt.secretRefreshToken, (err, payload) => {
            if (err) {
                return rej(err)
            }
            client.get(payload.sub, (err, reply) => {
                if (err) return rej(new ApiError(status.INTERNAL_SERVER_ERROR, 'Internal server error').orginalError(err))
                if (refreshToken === reply) return res(payload)
                return rej(ApiError(status.INTERNAL_SERVER_ERROR, status[500]))
            })
            // return res(payload);
        })
    })
}

module.exports = {
    generateAuthTokens,
    generateToken,
    getTokenByRefresh,
    verifyAccessToken,
    verifyRefreshToken,
    clearRefreshToken,
}
