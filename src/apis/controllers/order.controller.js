const status = require('http-status')

const catchAsync = require('../../utils/catch-async')
const env = require('../../configs/env')
const { authUserToken } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const { orderValidation } = require('../validations')

const { orderService } = require('../services/index')
const { getLanguage } = require('../../utils/getLanguage')
const cartService = require('../services/cart.service')
const { createVpnUrl, verifyReturnURL } = require('../../middlewares/vnp.js')
const productService = require('../services/product.service.js')

var that = (module.exports = {
    addOrder: [
        authUserToken,
        validate(orderValidation.orderAddBody),
        async (req, res) => {
            const lang = getLanguage(req)
            const products = await orderService.addOrder(req.userId, req.body, lang)

            const arr = products.map((item) => item.productId)

            await cartService.removeItemFromCart(req.userId, arr)
            res.status(status.OK).json({
                success: true,
            })
        },
    ],
    bankOrder: [
        authUserToken,
        validate(orderValidation.orderAddBody),
        createVpnUrl,
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)

            await orderService.bankOrder(req.userId, req.body, lang)

            res.status(status.OK).json({
                success: true,
                element: {
                    url: req.url,
                },
            })
        }),
    ],
    bankReturn: [
        verifyReturnURL,
        catchAsync(async (req, res) => {
            //req.query, req.params.keyCode
            const [prods, userId] = await orderService.bankReturn(req.query, req.params.keyCode)
            const arr = prods.map((item) => item.productId)

            await cartService.removeItemFromCart(userId, arr)

            return res.redirect(env.client.url)
        }),
    ],

    getOrdered: [
        authUserToken,
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)
            const orders = await orderService.getOrdered(req.userId)

            const products = await Promise.all(orders.map((item) => productService.getProductById(item.productId)))

            const result = productService.convertProductFollowByLanguage(products, lang)

            return res.status(200).json({
                element: {
                    products: result,
                },
            })
        }),
    ],
    updateStatusOrder: catchAsync(async (req, res) => {
        const result = await orderService.handleStatusOrder(req.body.id, +req.body.status)
        return res.status(200).json({
            success: true,
            element: {
                result,
            },
        })
    }),

    getOrders: [
        authUserToken,
        catchAsync(async (req, res) => {
            const orders = await orderService.getOrdered(req.userId)

            res.status(200).json({
                success: true,
                orders,
            })
        }),
    ],

    getDetailOrder: [
        authUserToken,
        catchAsync(async (req, res) => {
            const { orderId } = req.body
            const lang = getLanguage(req)

            let products = []
            const orders = await orderService.getOrders(orderId)

            if (!!orders.length && orderId) {
                let productsId = orders[0].products.map((item) => item.productId)

                const arr = productsId.map((id) => productService.getProductForOrderDetail(id))

                const result = await Promise.all(arr)

                products = productService.convertProductFollowByLanguage(result, lang)
            }

            return res.status(200).json({
                success: true,
                data: orders,
                products,
            })
        }),
    ],
})
