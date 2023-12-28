const Joi = require('joi')

const { password } = require('./customize.validation')

const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

const logoutSchema = {
    cookies: Joi.object().keys({
        _cookie: Joi.string().required(),
        'connect.sid': Joi.string(),
    }),
}

const getUserInfo = {
    userId: Joi.string().required(),
}

const registerSchema = {
    body: Joi.object().keys({
        // displayName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
}
const activeSendMail = {
    params: Joi.object().keys({
        token: Joi.string().required(),
    }),
}

module.exports = {
    loginSchema,
    logoutSchema,
    registerSchema,
    activeSendMail,
    getUserInfo,
}
