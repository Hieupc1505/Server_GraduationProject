const env = require('../configs/env')
const ApiError = require('../utils/api-error')
const status = require('http-status')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { _User } = require('../apis/models/index')
const authUserToken = async (req, res, next) => {
    const header = req.header('Authorization')
    try {
        const token = header && header.split(' ')[1]

        if (!token) throw new ApiError(status.FORBIDDEN, 'Forbidden')

        jwt.verify(token, env.jwt.secretAccessToken, (err, decoded) => {
            if (err) throw new ApiError(status.UNAUTHORIZED, 'Unauthorized')

            req.userId = decoded.sub

            next()
        })
    } catch (err) {
        next(err)
    }
}

const authAdmin = async (req, res, next) => {
    const header = req.header('Authorization')
    try {
        const token = header && header.split(' ')[1]

        if (!token) throw new createError.Forbidden()
        jwt.verify(token, env.jwt.secretAccessToken, async (err, decoded) => {
            if (err) throw new createError.Unauthorized(err)
            const user = await _User.findOne({ _id: decoded.sub })

            if (user?.userInfo?.role === 0) throw new createError.Forbidden('You are not admin!!')
            req.userId = decoded.sub
            // console.log('admin');
            next()
        }).catch((err) => {
            // console.log('not admin');
            next(err)
        })
    } catch (err) {
        next(err)
        // res.send(false);
    }
}

module.exports = {
    authUserToken,
    authAdmin,
}
