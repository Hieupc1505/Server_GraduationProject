const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const randomStr = require('../../utils/randomString')
const { toJSON, paginate } = require('./plugins')

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email')
                }
            },
        },
        password: {
            type: String,
            required: function () {
                return this.provider === 'lc' // Mật khẩu không được yêu cầu nếu có trường provider
            },
            // minlength: function () {
            //     return this.provider !== 'lc' ? 0 : 6 // Yêu cầu độ dài ít nhất là 6 kí tự nếu không có provider
            // },
            // validate(value) {
            //     if (this.provider === 'lc' && (!value.match(/\d/) || !value.match(/[a-zA-Z]/))) {
            //         throw new Error('Password must contain at least one letter and one number')
            //     }
            // },
            private: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            enum: ['lc', 'gg', 'fb'],
            default: 'lc',
        },
        userInfo: {
            displayName: {
                type: String,
                default: randomStr(6),
            },
            number: {
                type: Number,
                minLength: 10,
                maxLength: 10,
            },
            address: {
                type: String,
                default: '',
            },
            avatar: {
                type: String,
                default: 'https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png',
            },
            role: {
                type: Number,
                enum: [0, 1, -1],
                default: 0,
            },
        },
        liked: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

const otpSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
        length: 6,
    },
    time: {
        type: Date,
        default: Date.now,
        index: {
            expires: 60,
        },
    },
})

userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema)
const OTP = mongoose.model('otps', otpSchema)
module.exports = {
    _User: User,
    _Otp: OTP,
}
