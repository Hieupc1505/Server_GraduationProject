const status = require('http-status')

const tokenService = require('./token.service')
const userService = require('./user.service')
const ApiError = require('../../utils/api-error')
const { _Order, _Cart, _Product } = require('../models')
const { handlePrice } = require('../../utils/handlePrice')
const { filterProductByLang } = require('../../utils/filterProduct')
const { productService } = require('../services')

function getValueOptions(arr, selected) {
    return selected
        .split(',')
        .map((item, index) => {
            return arr[index].value[item]
        })
        .toString()
}

var that = (module.exports = {
    addProductToCart: async (userId, { productId, quantity, price, selected }, lang = 'vn') => {
        const inCartExist = await _Cart.checkProductInCart(userId, productId)
        // const isProductExist = await _Product.checkProductExist(productId)
        if (inCartExist) {
            throw new ApiError(status.BAD_REQUEST, 'Product is exists in your cart')
        }
        // if (!isProductExist) throw new ApiError(status.BAD_REQUEST, 'Product is not exists')

        const { optionsVn, optionsEn } = await productService.getOptoins(productId)
        const vn = getValueOptions(optionsVn, selected)
        const en = getValueOptions(optionsEn, selected)
        // console.log(price)
        const cart = await _Cart.findOneAndUpdate(
            {
                userId,
            },
            {
                $inc: { count: 1 },
                $push: {
                    products: {
                        $each: [
                            {
                                productId,
                                quantity,
                                options: {
                                    vn,
                                    en,
                                },
                                price: handlePrice(price, lang),
                            },
                        ],
                        $position: 0,
                    },
                },
                $setOnInsert: {
                    userId,
                },
            },
            {
                upsert: true,
                new: true,
            }
        )

        return cart.products
    },
    // productId, quantity, price, selected
    updateItemCart: async (userId, { productId, quantity, price, selected }, lang = 'vn') => {
        const inCartExist = await _Cart.checkProductInCart(userId, productId)
        // const isProductExist = await _Product.checkProductExist(productId)
        if (!inCartExist) {
            throw new ApiError(status.BAD_REQUEST, 'Product is not exists in your cart')
        }

        const { optionsVn, optionsEn } = await productService.getOptoins(productId)
        const vn = getValueOptions(optionsVn, selected)
        const en = getValueOptions(optionsEn, selected)

        return (
            await _Cart.findOneAndUpdate(
                { userId, 'products.productId': productId },
                {
                    $set: {
                        'products.$': {
                            productId,
                            quantity,
                            options: {
                                vn,
                                en,
                            },
                            price: handlePrice(price, lang),
                        },
                    },
                },
                {
                    upsert: false,
                    new: true,
                }
            )
        ).products
    },
    getAllCart: async (userId) => {
        const cart = (await _Cart.getAllCart(userId)).products
        return cart || []
    },
    removeItemFromCart: async (userId, products) => {
        const checkProduct = await Promise.all(products.map((productId) => _Cart.checkProductInCart(userId, productId)))
        if (checkProduct.includes(false)) {
            throw new ApiError(status.BAD_REQUEST, 'Sản phẩm không có trong giỏ hàng')
        }
        return (await _Cart.removeMuti(userId, products)).products
    },
    countCartLength: async (userId) => {
        return (await _Cart.getLengthCart(userId)).products.length
    },
    getProductFromCartItem: async (products, lang) => {
        return await Promise.all(
            products.map(async ({ productId, quantity, options, price }) => {
                const result = filterProductByLang(await productService.getProductById(productId), lang)

                return {
                    productId,
                    quantity,
                    type: options[lang],
                    price: price[lang],
                    sale: result.price,
                    name: result.name,
                    brand: result.brand,
                    inventory: result.inventory.quantity,
                    options: result.options,
                    img: result.images.main,
                }
            })
        )
    },
})
