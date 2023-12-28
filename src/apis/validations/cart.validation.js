const Joi = require('joi')

const cartBody = {
    body: Joi.object().keys({
        productId: Joi.string().required(),
        quantity: Joi.number().required(),
        selected: Joi.string(),
        price: Joi.number(),
    }),
}

module.exports = {
    cartBody,
}
