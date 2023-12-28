const Joi = require('joi')

const orderAddBody = {
    body: Joi.object().keys({
        address: Joi.string().required(),
        number: Joi.string().required(),
        cost: Joi.number(),
        notes: Joi.string(),
        type: Joi.number().required(),
        total: Joi.number().required(),
        products: Joi.string().required(),
    }),
}

module.exports = {
    orderAddBody,
}
