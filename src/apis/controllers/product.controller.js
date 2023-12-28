const status = require('http-status')

const catchAsync = require('../../utils/catch-async')
const { productService, userService } = require('../services/index')
const env = require('../../configs/env')
const { authToken, authUserToken } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const { productValidation } = require('../validations')
const { filterProductByLang } = require('../../utils/filterProduct')
const { getLanguage } = require('../../utils/getLanguage')
const { uploadSingleImage, uploadLoadMultipleImages, removeImg, removeByResource } = require('../../utils/cloudinary.utils')
const { getSourceImage } = require('../../utils/common')
const createError = require('http-errors')
var that = (module.exports = {
    initProduct: catchAsync(async (req, res) => {
        await productService.initProduct()
        res.status(status.OK).json({ succes: true, message: 'Add product successfully' })
    }),
    getProductById: catchAsync(async (req, res) => {
        const lang = getLanguage(req)
        const product = await productService.getProductById(req.params.id)
        const labels = await productService.getLabelModel(lang)
        const result = productService.convertProductFollowByLanguage(product, lang)
        res.status(status.OK).json({
            succes: true,
            element: {
                product: result,
                labels,
            },
        })
    }),
    getProductByCategory: [
        validate(productValidation.categorySchema),
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)
            const prod = await productService.getProductByCategory(req.query.c, lang)
            const result = productService.convertProductFollowByLanguage(prod, lang)
            res.status(status.OK).json({
                succes: true,
                element: {
                    data: result,
                },
            })
        }),
    ],
    searchAndFilterProduct: [
        validate(productValidation.searchProduct),
        catchAsync(async (req, res) => {
            const { key, c, r, min, max, sort = 1 } = req.query //mặc định sort tăng dần
            const lang = getLanguage(req)
            const data = await productService.searchAndFilter(key, c, r, min, max, lang, +sort)
            const labels = await productService.getLabelModel(lang)
            const result = productService.convertProductFollowByLanguage(data, lang)
            const categories = Array.from(await productService.getCatergory(data))
            return res.status(status.OK).json({
                success: true,
                element: {
                    data: result,
                    categories,
                    labels,
                },
            })
        }),
    ],
    getProductByLatest: [
        catchAsync(async (req, res) => {
            const lang = getLanguage(req)

            const products = await productService.getProductByDate()

            const result = productService.convertProductFollowByLanguage(products, lang)
            return res.status(status.OK).json({
                success: true,
                element: {
                    data: result,
                },
            })
        }),
    ],
    getListBySelled: catchAsync(async (req, res) => {
        const lang = getLanguage(req)
        const amount = 4
        const data = await productService.getProductBySelled(amount)
        const result = await Promise.all(data.map((item) => productService.getProductByInventoryId(item)))

        return res.status(status.OK).json({
            success: true,
            element: {
                data: productService.convertProductFollowByLanguage(result, lang),
            },
        })
    }),

    addProduct: catchAsync(async (req, res) => {
        const data = req.body
        const { images } = data
        const main = await uploadSingleImage(images.main)
        // console.log('upload main')
        let list = []
        if (!!images.list) list = await uploadLoadMultipleImages(images.list)

        const inventory = await productService.initInventory(+data.inventory)
        // console.log(inventory)
        const product = {
            name: {
                vn: data.name,
                en: data.name_en,
            },
            price: {
                vn: +data.price,
                en: +data.price_en,
            },
            brand: {
                en: data.brand,
                vn: data.brand,
            },
            description: {
                vn: data.description,
                en: data.description_en,
            },
            options: [
                {
                    value: {
                        vn: data.colors,
                        en: data.colors_en,
                    },
                    key: 'colors',
                    label: { en: 'Colors', vn: 'Màu Sắc' },
                },
                {
                    key: 'sizes',
                    value: data.sizes,
                    label: {
                        en: 'Sizes',
                        vn: 'Kích Thước',
                    },
                },
            ],
            images: {
                main,
                list,
            },
            specs: [
                {
                    key: 'Category',
                    label: { vn: 'Thể Loại', en: 'Category' },
                    value: data.category,
                },
                {
                    key: 'weight',
                    label: { vn: 'Cân Nặng', en: 'weight' },
                    value: +data.weight,
                },
                {
                    key: 'material',
                    label: { vn: 'Chất Liệu', en: 'Material' },
                    value: data.material,
                },
                {
                    key: 'sale',
                    label: { vn: 'sale off', en: 'Giảm giá' },
                    value: data.sale ? data.sale : 0,
                },
            ],
            inventory: inventory._id,
        }

        const result = await productService.createProduct(product)

        return res.status(200).json({
            succes: true,
            data: result,
        })
    }),

    adminGetProduct: catchAsync(async (req, res) => {
        const product = await productService.getFullInfo(req.body.productId)
        return res.status(200).json({
            status: true,
            element: product,
        })
    }),

    editProduct: catchAsync(async (req, res) => {
        const { productId, product, preImages, inventory } = req.body

        const images = {}

        if (!!product.images.main) {
            const imageId = getSourceImage(preImages.main)
            await removeByResource([imageId])
            images['main'] = await uploadSingleImage(product.images.main)
        }

        if (!!product.images.list) {
            const imagesId = preImages.list.map((item) => getSourceImage(item))
            await removeByResource(imagesId)
            images['list'] = await uploadLoadMultipleImages(product.images.list)
        }

        if (!product.images.main) {
            images['main'] = preImages.main
        }
        if (!product.images.list) {
            images['list'] = preImages.list
        }

        product.images = images

        await productService.updateInventory(inventory._id, inventory.quantity)
        // console.log(updateQuantity)

        const updateProduct = await productService.updateProduct(productId, product)
        // if (!updatedProduct) {
        //     return res.status(404).json({ error: 'Sản phẩm không tồn tại' })
        // }
        return res.status(200).json({
            success: true,
            element: {
                productId,
            },
        })
    }),

    deleteProduct: catchAsync(async (req, res) => {
        const product = await productService.getProductById(req.body.productId)
        if (!product) throw new createError(400, 'Product not found')

        const { images } = product

        const imagesId = [images.main, ...images.list].map((item) => getSourceImage(item))
        // console.log(imagesId)

        await Promise.all([removeByResource(imagesId), productService.removeProduct(req.body.productId)])

        return res.status(200).json({
            succes: true,
        })
    }),

    addLikeProduct: [
        authUserToken,
        catchAsync(async (req, res) => {
            // console.log(req.userId, req.body.productId)

            await userService.addLikeProduct(req.userId, req.body.productId)
            res.status(200).json({
                success: true,
            })
        }),
    ],
    listLiked: [
        authUserToken,
        catchAsync(async (req, res) => {
            // console.log(req.userId)
            const lang = getLanguage(req)
            const data = (await userService.userInfo(req.userId))?.liked ?? []
            let products = []
            if (!!data.length) {
                const list = await Promise.all(data.map((item) => productService.getProductById(item)))

                products = productService.convertProductFollowByLanguage(list, lang)
            }
            return res.status(200).json({
                success: true,
                liked: products,
            })
        }),
    ],
})
