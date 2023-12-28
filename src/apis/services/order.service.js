const status = require('http-status')

const tokenService = require('./token.service')
const userService = require('./user.service')
const ApiError = require('../../utils/api-error')
const { _Order } = require('../models/index')
const { handlePrice } = require('../../utils/handlePrice')
const client = require('../../loaders/redisLoader')
const { encodeBase64, decodeBase64ToUTF8 } = require('../../utils/random')
const { ObjectId } = require('mongodb')
const { _Inventory } = require('../models/product.model')

const pay = {
    vn: ['Thanh toán khi nhận hàng', 'Thanh toán ngân hàng', 'Chuyển khoản QR code'],
    en: ['Cash on delivery', 'Bank transfer', 'QR code transfer'],
}

module.exports = {
    addOrder: async (userId, { address, number, cost, notes, type, total, products }, lang = 'vn') => {
        const nCost = handlePrice(cost, lang)
        const nTotal = handlePrice(total, lang)

        await _Order.create({
            userId,
            products: JSON.parse(products),
            shipping: {
                address,
                number,
                cost: nCost,
                notes,
            },
            payment: {
                type,
                total: nTotal,
                vnp_Code: null,
                status: null,
            },
            status: 0,
        })

        return JSON.parse(products)
    },
    bankOrder: async (userId, { address, number, cost, notes, type, total, products, keyCode }, lang = 'vn') => {
        const nCost = handlePrice(cost, lang)
        const nTotal = handlePrice(total, lang)
        const tempOrder = {
            userId,
            products: JSON.parse(products),
            shipping: {
                address,
                number,
                cost: nCost,
                notes,
            },
            payment: {
                type,
                total: nTotal,
                vnp_Code: null,
                status: 0,
            },
            status: 0,
        }

        const data = encodeBase64(tempOrder)

        await client.set(keyCode, data, 'EX', 15 * 60)

        return true
    },

    bankReturn: async ({ vnp_ResponseCode, isVerify }, keyCode) => {
        if (!isVerify) throw new ApiError(status.FORBIDDEN, 'Forbidden')

        let isExist = await client.exists(keyCode)
        if (isExist === 0) throw new ApiError(status.BAD_REQUEST, 'Bad Request')

        const data = decodeBase64ToUTF8(await client.get(keyCode))

        if (vnp_ResponseCode === '00') {
            data.payment.vnp_Code = vnp_ResponseCode
            data.payment.status = 1
        } else {
            data.payment.vnp_Code = vnp_ResponseCode
            data.payment.status = -1
        }

        const [result, _] = await Promise.all([_Order.create(data), client.del(keyCode)])
        return [data.products, data.userId]
    },

    //route for admin
    getOrders: async (id) => {
        let pipeline = []
        let products = []

        if (!!id) {
            pipeline.push({
                $match: {
                    _id: ObjectId(id),
                },
            })
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'users', // Tên của collection người dùng
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    userId: '$userId',
                    address: '$shipping.address',
                    number: '$shipping.number',
                    payStatus: '$payment.status',
                    pay: '$payment.type',
                    status: '$status',
                    products: '$products',
                    total: { $sum: ['$payment.total.vn', '$shipping.cost.vn'] },
                    email: { $arrayElemAt: ['$user.email', 0] },
                    createdAt: 1,
                    updatedAt: 1,
                },
            }
        )

        return await _Order.aggregate(pipeline)

        // .aggregate([
        //     {
        //         $match: {
        //             'userInfo.role': { $ne: 0 },
        //         },
        //     },
        //     {
        //         $project: {
        //             avatar: '$userInfo.avatar',
        //             displayName: '$userInfo.displayName',
        //             email: 1,
        //             address: {
        //                 $concat: ['$userInfo.address.detail', ', ', '$userInfo.address.main'],
        //             },
        //             role: '$userInfo.role',
        //             provider: 1,
        //         },
        //     },
        // ])
    },
    getOrderDetail: async () => {
        return await _Order.aggregate([
            {
                $lookup: {
                    from: 'users', // Tên của collection người dùng
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    userId: '$userId',
                    address: '$shipping.address',
                    number: '$shipping.number',
                    payStatus: '$payment.status',
                    pay: '$payment.type.en',
                    status: '$status',
                    products: '$products',
                    email: { $arrayElemAt: ['$user.email', 0] },
                    // user: { $arrayElemAt: ['$user', 0], 'user.email': '$user.email' },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ])
    },
    getOrdered: async (userId) => {
        const orders = await _Order
            .find({
                userId,
            })
            .sort({ updatedAt: -1 })
        // return orders.map((item) => item.products).flat()
        return orders
    },
    handleStatusOrder: async (_id, status) => {
        return await _Order.findOneAndUpdate(
            { _id },
            {
                $set: {
                    status,
                },
            },
            {
                new: true,
            }
        )
    },
    getDataOrderByStatus: async (status) => {
        return _Order.aggregate([
            {
                $match: {
                    status: status, // Chỉ lấy các documents có trạng thái đã bán (status = 1)
                },
            },
            {
                $unwind: '$products', // Tách mảng products thành các documents riêng biệt
            },
            {
                $group: {
                    _id: { $month: '$createdAt' }, // Nhóm theo tháng
                    totalQuantity: { $sum: '$products.quantity' }, // Tính tổng số lượng sản phẩm đã bán
                    money: { $sum: '$products.pay' },
                },
            },
            {
                $sort: {
                    _id: 1, // Sắp xếp kết quả theo tháng tăng dần
                },
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id', // Chuyển đổi _id tháng thành chuỗi và thêm tiền tố "M"
                    totalQuantity: 1,
                    money: 1,
                },
            },
        ])
    },
}
