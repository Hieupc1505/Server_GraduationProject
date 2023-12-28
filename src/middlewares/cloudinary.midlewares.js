// const createError = require('http-errors')
const multer = require('multer')

const { storage } = require('../loaders/cloudinaryLoader')
const createError = require('http-errors')

const {
    cloudinary: { fileFilter },
} = require('../utils')
// Tạo middleware
const uploadCloud = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // giới hạn kích thước tệp tin tối đa là 2MB cho mỗi tệp tin
    // fileFilter,
})

// const createError = require('http-errors')
const { uploadImagesSequentially } = require('../utils/cloudinary.utils')
// const { cloudinary } = require('@v2/configs/cloudinary.config')

const { validImage } = require('../utils')

const uploadImgBase64 = async (req, res, next) => {
    try {
        const { images } = req.body
        const [errors, data] = validImage(images)
        if (!!errors.length) {
            throw new createError.BadRequest(errors)
        }
        const result = await uploadImagesSequentially(data) //bt là vế thứ 2 có cloudinary
            .then((result) => result)
            .catch(next)
        req.body.images = result
        next()
    } catch (err) {
        // console.log(err);
        next(err)
    }
}

module.exports = { uploadImgBase64, uploadCloud }
