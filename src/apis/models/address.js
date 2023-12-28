const { Schema, model, Types } = require('mongoose')
const ApiError = require('../../utils/api-error')
const status = require('http-status')

const addressModel = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: Number,
            required: true,
        },
        codename: {
            type: String,
            required: true,
        },
        division_type: {
            type: String,
            required: true,
        },
        phone_code: {
            type: Number,
            required: false,
        },
        level: {
            type: Number,
            required: true,
        },
        parents: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'address',
        timestamps: true,
    }
)

module.exports = {
    _Address: model('address', addressModel),
}
