const status = require('http-status')

const tokenService = require('./token.service')
const { _Product, _Inventory } = require('../models/index')
const ApiError = require('../../utils/api-error')
const lib = require('../../utils/initProduct')
const mongoose = require('mongoose')
const { filterProductByLang } = require('../../utils/filterProduct')

var that = (module.exports = {
    getProductByCategory: async (category) => {
        const list = await _Product.find({ 'specs.key': 'category', 'specs.value': category })
        if (!list) throw new ApiError(status.BAD_REQUEST, 'Bad Request')
        return list
    },
    searchProduct: async (text) => {
        await _Product.find({
            $text: {
                $search: text,
            },
        })
    },
    searchAndFilter: async (text, category, rate, min = 0, max, lang, sort) => {
        let query = { $text: { $search: text } }
        if (category) query = { ...query, 'specs.value': category }
        if (rate) query = { ...query, rates: { $gt: rate } }
        if (min || max) query = { ...query, 'price.vn': { $gte: +min, $lte: +max || 10000000 } }

        return await _Product
            .find(query)
            .sort({ 'price.vn': +sort })
            .populate('inventory', { selled: 1, quantity: 1, reservations: 1 })
    },
    getProductByPrice: async (min, max, sort) => {},
    getProductByDate: async () => {
        return await _Product.findListLatestProduct()
    },
    getProductBySelled: async (amount) => {
        const selled = await _Inventory.find().select({ _id: 1 }).sort({ selled: -1 }).limit(amount)

        return selled
    },
    getLabelModel: async (lang) => {
        return await _Product.getLabels(lang)
    },
    convertProductFollowByLanguage: (products, lang = 'vn') => {
        if (lang !== 'vn' && lang !== 'en') throw new ApiError(status.BAD_REQUEST, 'Bad Request')
        if (Array.isArray(products) && !!products.length) {
            return products.map((item) => filterProductByLang(item, lang))
        }
        return filterProductByLang(products, lang)
    },

    /**
     *
     * @param {string} productId
     * @returns {Promise<_Product>}
     */
    getProductById: async (productId) => {
        const product = await _Product.findProductById(productId)

        if (!product) throw new ApiError(status.BAD_REQUEST, 'Bad requrest')

        return product
    },
    getProductByInventoryId: async (id) => {
        const product = await _Product
            .findOne({ inventory: id })
            .populate({ path: 'inventory', select: { _id: 0, selled: 1 } })
        if (!product) throw new ApiError(status.BAD_REQUEST, 'Bad Request')
        return product
    },

    initInventory: async (number) => {
        return await _Inventory.create({
            selled: 0,
            quantity: number,
            reservations: [],
        })
    },

    initProduct: async () => {
        try {
            const { categories, materials, sizes, names, descriptions, exchange, randomColor, quantity } = lib

            for (let i = 0; i < 15; i++) {
                const number = Math.floor(Math.random() * (names['vn'].length - 1))
                const [colorsEn, colorsVn] = randomColor()

                const ivt = await _Inventory.create({
                    selled: 0,
                    quantity: quantity(),
                    reservations: [],
                })

                const product = new _Product({
                    price: {
                        vn: Math.floor(Math.random() * 300000) + 100000,
                        en: Math.floor((Math.random() * 300000) / exchange) + 4.1,
                    },
                    name: {
                        vn: names['vn'][number],
                        en: names['en'][number],
                    },
                    brand: {
                        en: `Y&M Shop`,
                        vn: 'Y&M Shop',
                    },
                    description: {
                        vn: descriptions['vn'][number],
                        en: descriptions['en'][number],
                    },
                    release_date: new Date(),
                    rates: [],
                    specs: [
                        {
                            key: 'Category',
                            label: { vn: 'Thể Loại', en: 'Category' },
                            value: categories[Math.floor(Math.random() * (categories.length - 1))],
                        },
                        {
                            key: 'weight',
                            label: { vn: 'Cân Nặng', en: 'weight' },
                            value: Math.floor(Math.random() * 1000) + 100,
                        },
                        {
                            key: 'material',
                            label: { vn: 'Chất Liệu', en: 'Material' },
                            value: materials[Math.floor(Math.random() * materials.length)],
                        },
                    ],
                    inventory: ivt._id, // Tạo một ObjectId ngẫu nhiên
                    options: [
                        {
                            value: {
                                en: colorsEn,
                                vn: colorsVn,
                            },
                            key: 'colors',
                            label: { en: 'Colors', vn: 'Màu Sắc' },
                        },
                        {
                            key: 'sizes',
                            value: sizes,
                            label: {
                                en: 'Sizes',
                                vn: 'Kích Thước',
                            },
                        },
                    ],
                })

                await product.save()
            }
        } catch (error) {
            console.error('Error creating product collections:', error)
        }
    },

    getOptoins: async (productId) => {
        const product = await _Product.findProductById(productId)
        if (!product) throw new ApiError('Product is not exitst')
        const optionsVn = filterProductByLang(product, 'vn')
        const optionsEn = filterProductByLang(product, 'en')
        return {
            optionsVn: optionsVn.options,
            optionsEn: optionsEn.options,
        }
    },
    getCatergory: async (produts) => {
        const temp = await produts.map(({ specs }) => (specs[0].key === 'Category' ? specs[0].value : false)).filter(Boolean)
        return new Set(temp)
    },

    //for admin
    getAllProduct: async () => {
        return await _Product.find()
    },
    getAllCategory: async () => {
        return await _Product.distinct('specs.0.value', { 'specs.key': 'category' })
    },

    getProductForOrderDetail: async (id) => {
        const product = await _Product.findById(id, { _id: 1, name: 1, images: 1 })

        // if (!product) throw new ApiError(status.BAD_REQUEST, 'Bad requrest')

        return product
    },

    //update Inventory
    updateInventory: async (id, quantity) => {
        return await _Inventory.findOneAndUpdate(
            { _id: id },
            {
                quantity,
            },
            {
                new: true,
            }
        )
    },

    //full info product
    getFullInfo: async (_id) => {
        return await _Product.findOne({ _id }).populate({ path: 'inventory', select: { _id: 1, quantity: 1 } })
    },

    //create product
    createProduct: async (product) => {
        return await _Product.create(product)
    },

    updateProduct: async (productId, product) => {
        return await _Product.findOneAndUpdate({ _id: productId }, { ...product }, { new: true })
    },
    removeProduct: async (productId, inventoryId) => {
        await _Inventory.findOneAndDelete({ _id: inventoryId })
        return await _Product.findOneAndDelete({ _id: productId })
    },
})
