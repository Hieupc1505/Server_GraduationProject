const { Schema, model, Types } = require('mongoose')
const ApiError = require('../../utils/api-error')
const status = require('http-status')
//Product model
const productSchema = new Schema(
    {
        name: {
            type: {
                vn: String,
                en: String,
            },
            required: true,
            label: {
                vn: 'Tên',
                en: 'Name',
            },
        },
        price: {
            type: {
                vn: Number,
                en: Number,
            },
            min: 100000,
            required: true,
            label: {
                vn: 'Giá',
                en: 'Price',
            },
        },
        brand: {
            type: {
                vn: String,
                en: String,
            },
            lable: {
                vn: 'Thương hiệu',
                en: 'Brand',
            },
            default: {
                en: 'Y&M shop',
                vn: 'Y&M shop',
            },
        },
        description: {
            type: {
                en: String,
                vn: String,
            },
            label: {
                vn: 'Mô Tả Sản Phẩm',
                en: 'Description',
            },
        },
        release_date: {
            type: Date,
            default: Date.now,
        },
        rates: {
            type: Array,
            default: [],
        },
        options: {
            type: Array,
            default: [],
            //{key: {
            //vn: màu sắc , en: color
            //}, value: vn: ['đỏ', 'xanh', 'vàng', 'đen'], en: }
            //{key: size, ['40', '41', '42', '46']}
        },
        images: {
            type: Object,
            default: {
                main: String,
                list: Array,
            },
            required: true,
        },
        specs: {
            type: Array,
            default: [],
        },
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'inventories',
            label: {
                vn: 'Số Lượng Hàng',
                en: 'Inventory',
            },
        },
    },
    {
        collection: 'products',
        timeseries: true,
    }
)

//inventories model
const inventoriesSchema = new Schema(
    {
        selled: Number,
        quantity: {
            type: Number,
            required: true,
        }, //sẽ trừ sl trong reservation là số lượng sp đã được đặt hàng.
        reservations: Array,
        /*
            [
                {userId: 1, quantity: 10}
                {userId: 2, quantity: 20}
            ]
        */
    },
    {
        collection: 'inventories',
        timestamps: true,
    }
)
productSchema.statics.getLabels = function (lang) {
    let obj = {}
    const fields = Object.keys(this.schema.paths)
    fields.forEach((item) => {
        const label = this.schema.path(item).options?.label
        if (label) {
            obj[item] = label[lang]
        }
    })

    return obj
}

productSchema.statics.findProductById = async function (id) {
    const product = await this.findOne({ _id: id }).populate('inventory', { selled: 1, quantity: 1, reservations: 1 })
    if (!product) throw new ApiError(status.BAD_REQUEST, 'Bad request')
    return product
}

productSchema.statics.checkProductExist = async function (id) {
    return await this.findOne({ _id: id }).catch((err) => {
        throw new ApiError(status.BAD_REQUEST, 'Bad Request')
    })
}

productSchema.statics.findListLatestProduct = async function (num = 10) {
    return await this.find()
        .populate({ path: 'inventory', select: { _id: 0, selled: 1 } })
        .sort({ release_date: -1 })
        .limit(num)
}

module.exports = {
    _Products: model('products', productSchema),
    _Inventory: model('inventories', inventoriesSchema),
}
