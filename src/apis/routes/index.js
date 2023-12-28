const express = require('express')

const authRoute = require('./v1/auth.route')
const taskRoute = require('./v1/task.route')
const userRoute = require('./v1/user.route')
const googleRotue = require('./v1/google.route')
const productRoute = require('./v1/product.route')
const cartRoute = require('./v1/cart.route')
const orderRoute = require('./v1/order.route')
const adminRoute = require('./v1/admin.route')
const addressRoute = require('./v1/address.route')

const router = express.Router()

const defaultRoutes = [
    {
        path: '/v1/auth',
        route: authRoute,
    },
    {
        path: '/v1/tasks',
        route: taskRoute,
    },
    {
        path: '/v1/user',
        route: userRoute,
    },
    {
        path: '/v1/gg/',
        route: googleRotue,
    },
    {
        path: '/v1/product/',
        route: productRoute,
    },
    {
        path: '/v1/cart/',
        route: cartRoute,
    },
    {
        path: '/v1/order/',
        route: orderRoute,
    },
    {
        path: '/v1/admin',
        route: adminRoute,
    },
    {
        path: '/v1/address',
        route: addressRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router
