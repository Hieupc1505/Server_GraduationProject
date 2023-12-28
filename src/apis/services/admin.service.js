const status = require('http-status')

const tokenService = require('./token.service')
const userService = require('./user.service')
const ApiError = require('../../utils/api-error')
const { _Order, _Cart, _Product, _User } = require('../models')
const { handlePrice } = require('../../utils/handlePrice')
const { filterProductByLang } = require('../../utils/filterProduct')
const { productService } = require('../services')
const orderService = require('./order.service')

var that = (module.exports = {
    getAdministrators: async () => {
        return await userService.administrators()
    },
    getAdministratorDetail: async (id) => {
        return await userService.getAdministratorDetail(id)
    },
    getCustomers: async () => {},
    getProducts: async () => {},
    getOrders: async () => {},
    getDashboard: async () => {
        const products = await _Product.find().count()
        const newProducts = await _Product
            .find({
                release_date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            })
            .count()
        const orders = await _Order.find().count()
        const newOrder = await _Order
            .find({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            })
            .count()

        const customer = await _User.find().count()
        const newCustomer = await _User
            .find({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            })
            .count()

        const orderWait = await orderService.getDataOrderByStatus(1)
        const orderSuccess = await orderService.getDataOrderByStatus(2)
        // const orderCancel = await orderService.getDataOrderByStatus(-1)

        return {
            element: {
                products: { total: products, new: newProducts },
                orders: { total: orders, new: newOrder },
                customer: { total: customer, new: newCustomer },
                orderWait: handleData(orderWait),
                orderSuccess: handleData(orderSuccess),
                total: countTotal(orderWait) + countTotal(orderSuccess),
            },
        }
    },
})

function handleData(data) {
    let count = 0
    return Array.from({ length: 12 }).map((item, index) => {
        let m = index + 1
        if (m === data[count]?.month) {
            let temp = {
                x: 'T' + data[count].month,
                y: data[count].totalQuantity,
            }
            ++count
            return temp
        }
        return {
            x: 'T' + (index + 1),
            y: 0,
        }
    })
}

function countTotal(data) {
    let total = 0
    data.forEach((item) => {
        total += item.money
    })
    return total
}
