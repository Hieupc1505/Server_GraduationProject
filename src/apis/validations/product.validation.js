const Joi = require('joi')

const { password } = require('./customize.validation')

const searchProduct = {
    query: Joi.object().keys({
        key: Joi.string().required(),
        c: Joi.string().default(null),
        r: Joi.string().default(null),
        min: Joi.string().default(null),
        max: Joi.string().default(null),
        sort: Joi.string(),
    }),
}

module.exports = {
    searchProduct,
}
