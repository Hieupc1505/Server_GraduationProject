const status = require('http-status')

const catchAsync = require('../../utils/catch-async')
const { adminService, productService, orderService, userService } = require('../services')
const env = require('../../configs/env')
const { authUserToken, authAdmin } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const filterTypeBodyImg = require('../../middlewares/filterTypeBodyImg')
// const { uploadImgBase64, uploadCloud } = require('../../middlewares/cloudinary.midlewares')
const { uploadSingleImage, uploadLoadMultipleImages } = require('../../utils/cloudinary.utils')

const administrators = [
    authAdmin,
    catchAsync(async (req, res) => {
        return res.status(200).json({
            data: await adminService.getAdministrators(),
        })
    }),
]
const adminDetail = [
    authAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.body
        return res.status(200).json({
            data: await adminService.getAdministratorDetail(id),
        })
    }),
]

const customers = [
    authAdmin,
    catchAsync(async (req, res) => {
        return res.status(200).json({
            customers: await userService.customers(),
        })
    }),
]
const customerDetail = [
    authAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.body

        return res.status(200).json({
            customer: await userService.customerDetail(id),
        })
    }),
]

const categories = catchAsync((req, res) => {})

const products = [
    authAdmin,
    catchAsync(async (req, res) => {
        const products = await productService.getAllProduct()
        const result = await productService.convertProductFollowByLanguage(products, 'vn')
        return res.status(200).json({
            data: result,
        })
    }),
]

const orders = [
    authAdmin,
    catchAsync(async (req, res) => {
        const query = req.query
        let products = []
        const orders = await orderService.getOrders(query?.id)

        if (!!orders.length && query?.id) {
            let productsId = orders[0].products.map((item) => item.productId)

            const arr = productsId.map((id) => productService.getProductForOrderDetail(id))
            const result = await Promise.all(arr)
            products = result
        }

        return res.status(200).json({
            data: orders,
            products,
        })
    }),
]

// const uploadImage = [
//     // filterTypeBodyImg,
//     uploadCloud.array('image', 10),
//     catchAsync(async (req, res) => {
//         console.log(req.files.map((item) => item.path))
//         return res.status(200).json({
//             status: 'oki',
//         })
//     }),
// ]

const uploadImageBase64Single = (req, res) => {
    uploadSingleImage(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err))
}
const uploadLoadBase64Multiple = catchAsync(async (req, res) => {
    await uploadLoadMultipleImages(req.body.images)
        .then((urls) => res.send(urls))
        .catch((err) => res.status(500).send(err))
})

const getAllCategory = [
    authAdmin,
    catchAsync(async (req, res) => {
        const categories = await productService.getAllCategory()

        res.status(200).json({
            categories: categories.map((item, index) => ({ key: index, value: item })),
            success: true,
        })
    }),
]

const getProductByCategory = [
    authAdmin,
    catchAsync(async (req, res) => {
        const products = await productService.getProductByCategory(req.body.category)
        const result = productService.convertProductFollowByLanguage(products, 'vn')
        return res.status(200).json({
            success: true,
            data: result,
        })
    }),
]

const getDashboard = [
    authAdmin,
    catchAsync(async (req, res) => {
        const data = await adminService.getDashboard()
        return res.status(200).json({
            success: true,
            ...data,
        })
    }),
]

module.exports = {
    administrators,
    customers,
    categories,
    products,
    orders,
    adminDetail,
    customerDetail,
    // uploadImage,
    uploadImageBase64Single,
    uploadLoadBase64Multiple,
    getAllCategory,
    getProductByCategory,
    getDashboard,
}
