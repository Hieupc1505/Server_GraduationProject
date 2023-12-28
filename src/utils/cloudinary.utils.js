// const { cloudinary } = require('../loaders/cloudinaryLoader')

const createError = require('http-status')
const randomString = require('../utils/randomString')
// const { uploadImage } = require('../apis/controllers/admin.controller')
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../configs/env').img

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

const uploadImage = (image, folderName = 'ymshop') => {
    return new Promise((res, rej) => {
        cloudinary.uploader.upload(image, opts(folderName), (err, result) => {
            if (result && result.secure_url) {
                return res(result.secure_url)
            }

            return rej({ message: err.message })
        })
    })
}

const removeImage = async (source) => {
    const message = await cloudinary.api.delete_resources([source], { type: 'upload', resource_type: 'image' })

    return message ? 1 : 0
}

const opts = (folder = 'ymshop') => ({
    folder,
    timeout: 300000,
    overwrite: true,
    invalidate: true,
    resource_type: 'auto',
})

var that = (module.exports = {
    removeByResource: (sources) => {
        return new Promise((res, rej) => {
            const removes = sources.map((base) => removeImage(base))
            Promise.all(removes)
                .then((values) => res(values.every((item) => item === 1)))
                .catch((err) => rej(err))
        })
    },

    removeImg: (filename) => {
        return new Promise((res, rej) => {
            if (!filename) rej('file name is required')
            cloudinary.uploader.destroy(filename, async (err, result) => {
                if (err) rej(err)
                res(true)
            })
        })
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra định dạng tệp tin

        if (!file.mimetype.match(/(jpg|jpeg|png|webp)$/)) {
            return cb(new Error(`File ${file.originalname} không được hỗ trợ.`))
        }

        if (req.method === 'PATCH' && !req.body.productId) {
            return cb(new createError.BAD_REQUEST('ProductId is required'))
        }
        // Kiểm tra kích thước tệp tin
        cb(null, true)
    },
    uploadImagesSequentially: (images, folderName = 'ymshop') => {
        const results = []

        return images.reduce((promiseChain, image, index) => {
            return promiseChain.then(() => {
                return new Promise((resolve, reject) => {
                    const [filename, base64String] = image

                    cloudinary.uploader.upload(
                        base64String,
                        {
                            // public_id: `${filename}${randomString(6)}`,
                            folder: folderName,
                            timeout: 60000,
                            overwrite: true,
                            invalidate: true,
                            resource_type: 'auto',
                        },
                        (err, result) => {
                            if (err) reject(err)
                            else {
                                results.push({ filename: result.public_id, path: result.url })
                                // Remove the uploaded image from the array and call the function recursively with the remaining images.
                                if (index === images.length - 1) {
                                    resolve(results)
                                } else {
                                    resolve()
                                }
                            }
                        }
                    )
                })
            })
        }, Promise.resolve())
    },

    uploadSingleImage: (image, folderName = 'ymshop') => {
        return new Promise((res, rej) => {
            cloudinary.uploader.upload(image, opts(folderName), (err, result) => {
                if (result && result.secure_url) {
                    return res(result.secure_url)
                }

                return rej({ message: err.message })
            })
        })
    },

    uploadLoadMultipleImages: (images) => {
        return new Promise((res, rej) => {
            const uploads = images.map((base) => uploadImage(base))
            Promise.all(uploads)
                .then((values) => res(values))
                .catch((err) => rej(err))
        })
    },
})
