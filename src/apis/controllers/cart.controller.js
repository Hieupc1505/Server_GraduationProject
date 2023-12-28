const status = require('http-status')

const catchAsync = require('../../utils/catch-async')

const env = require('../../configs/env')
const { authUserToken } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const { cartService, productService } = require('../services')
const { cartBody } = require('../validations/cart.validation')
const { filterProductByLang } = require('../../utils/filterProduct')
const { getLanguage } = require('../../utils/getLanguage')

var that = (module.exports = {
    addToCart: [
        authUserToken,
        validate(cartBody),
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)
            const cart = await cartService.addProductToCart(req.userId, req.body, lang)
            const products = await cartService.getProductFromCartItem(cart, lang)
            return res.status(status.OK).json({
                success: true,
                element: {
                    cart: products,
                },
            })
        }),
    ],
    getAllCart: [
        authUserToken,
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)
            const cart = await cartService.getAllCart(req.userId)
            const products = await cartService.getProductFromCartItem(cart, lang)

            return res.status(status.OK).json({
                succcess: true,
                element: {
                    cart: products,
                },
            })
        }),
    ],
    removeCart: [
        authUserToken,
        catchAsync(async (req, res) => {
            const arrItem = JSON.parse(req.body.k)
            const lang = getLanguage(req)
            const cart = await cartService.removeItemFromCart(req.userId, arrItem)

            const products = await cartService.getProductFromCartItem(cart, lang)
            return res.status(status.OK).json({
                succcess: true,
                element: {
                    cart: products,
                },
            })
        }),
    ],
    updateTypeProdcut: [
        authUserToken,
        validate(cartBody),
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)
            const cart = await cartService.updateItemCart(req.userId, req.body, lang)
            const products = await cartService.getProductFromCartItem(cart, lang)

            return res.status(status.OK).json({
                success: true,
                element: {
                    cart: products,
                },
            })
        }),
    ],
})

// productId, quantity, price, selected
