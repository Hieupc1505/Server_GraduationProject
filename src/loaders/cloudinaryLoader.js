const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../configs/env').img
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

const { randomString } = require('../utils')
// Cấu hình CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary,
    // allowedFormats: ['jpg', 'png', 'webp'],
    params: {
        folder: 'ymshop',
        // public_id: (req, file) => {
        //     const str = randomString(6)
        //     file.originalname = file.originalname.replace(/(\.jpg|\.jpeg|\.png|\.webp)$/, '-')
        //     return `${file.originalname}${str}`
        // },
        format: 'jpg',
    },
    // filename: function (req, file, cb) {
    //     cb(null, file.originalname)
    // },
})

module.exports = {
    storage,
    cloudinary,
}
