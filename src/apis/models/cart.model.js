const { Schema, model, Types } = require('mongoose')
const ApiError = require('../../utils/api-error')
const status = require('http-status')
const cartModel = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        modifyOn: {
            type: Date,
            defaule: Date.now,
        },
        count: Number,
        products: {
            type: Array,
            default: [],
            //productId
            //quantity
            //options
            //price
        },
    },
    {
        collection: 'carts',
        timestamps: true,
    }
)

//Order model.
const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        shipping: Object, //detail shipping: address, sđt, type,
        payment: Object,
        products: Array,
        status: {
            type: Number,
            enum: [-1, 0, 1, 2],
            default: 0,
            //-1 : đã hủy, 0: chờ xác nhận, 1: đang giao, 2: đã giao
        },
    },
    {
        collection: 'orders',
        timestamps: true,
    }
)

cartModel.statics.checkProductInCart = async function (userId, productId) {
    return !!(await this.findOne({ userId, 'products.productId': productId }))
}

cartModel.statics.getAllCart = async function (userId) {
    return this.findOne({ userId }, { _id: 0, products: 1 })
}

cartModel.statics.removeMuti = async function (userId, products) {
    return await this.findOneAndUpdate(
        { userId, 'products.productId': { $in: products } },
        { $pull: { products: { productId: { $in: products } } }, $inc: { count: -products.length } },
        { multi: true, new: true }
    ).catch((err) => {
        throw new ApiError(status.BAD_REQUEST, 'Bad Request')
    })
}

cartModel.statics.getLengthCart = async function (userId) {
    return this.findOne({ userId }, { _id: 0, products: 1 })
}

module.exports = {
    _Cart: model('carts', cartModel),
    _Order: model('orders', orderSchema),
}
