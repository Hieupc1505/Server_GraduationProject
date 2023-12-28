const httpStatus = require('http-status')

const ApiError = require('../../utils/api-error')
const { _User } = require('../models')
const { Types } = require('mongoose')
/**
 *
 * @param {string} userId
 * @returns {User}
 */
const userInfo = async (userId) => {
    const user = await _User.findOne({ _id: userId })
    if (!user) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
    }
    return user
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await _User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
    }
    return _User.create(userBody)
}

const createUserByGoggle = async (userBody) => {
    const user = await _User.findOne({ email: userBody.email })
    if (user) return user
    return _User.create(userBody)
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return _User.findOne({ email })
}

/**
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserIsNotActivate = async (email) => {
    return _User.findOne({ email, isEmailVerified: false })
}

const verifyEmailByUserId = async (userId) => {
    const user = await _User.findOneAndUpdate(
        {
            _id: userId,
            isEmailVerified: false,
        },
        {
            $set: {
                isEmailVerified: true,
            },
        },
        {
            upsert: false,
            new: false,
        }
    )
    return user === null ? true : false
}
/**
 *
 */
const findUserById = async (id) => {
    const user = await _User.findOne({ _id: id, isEmailVerified: true })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request')
    return id
}

//add liked products
const addLikeProduct = async (userId, productId) => {
    const check = await _User.findOne({ _id: userId, liked: productId })
    if (!check)
        await _User.findOneAndUpdate(
            { _id: userId },
            {
                $push: {
                    liked: productId,
                },
            },
            { new: true }
        )
}

//get liked products
const getListLiked = async (userId) => {
    const data = await _User.findOne({ _id: userId })
    return data
}

const addLikedProduct = async (userId, productId) => {
    return await _User.findOneAndUpdate(
        {
            _id: userId,
        },
        {
            $push: {
                liked: productId,
            },
        },
        {
            new: true,
            upsert: true,
        }
    )
}

const deleteLikedItem = async (userId, productId) => {
    return await _User.findOneAndUpdate(
        {
            _id: userId,
            liked: productId,
        },
        {
            $pull: {
                liked: productId,
            },
        },
        {
            new: true,
            upsert: true,
        }
    )
}

//format return customer
const formCustomer = {
    avatar: '$userInfo.avatar',
    displayName: '$userInfo.displayName',
    email: 1,
    address: '$userInfo.address',
    role: '$userInfo.role',
    number: '$userInfo.number',
    provider: 1,
    isDeleted: 1,
}

//features for admin
const administrators = async () => {
    return await _User.aggregate([
        {
            $match: {
                'userInfo.role': { $ne: 0 },
            },
        },
        {
            $project: formCustomer,
        },
    ])
}
const getAdministratorDetail = async (_id) => {
    return await _User.aggregate([
        {
            $match: {
                'userInfo.role': { $ne: 0 },
                _id: Types.ObjectId(_id),
            },
        },
        {
            $project: formCustomer,
        },
    ])
}

const customers = async () => {
    return await _User.aggregate([
        {
            $match: {
                'userInfo.role': 0,
            },
        },
        {
            $project: formCustomer,
        },
    ])
}
const customerDetail = async (_id) => {
    return await _User.aggregate([
        {
            $match: {
                _id: Types.ObjectId(_id),
                'userInfo.role': 0,
            },
        },
        {
            $project: formCustomer,
        },
    ])
}

const deleteAccount = async (_id) => {
    await _User.findOneAndUpdate(
        { _id },
        {
            $set: {
                isDeleted: true,
            },
        },
        { new: true }
    )
    return 1
}
const updateInfo = async (_id, user, avatar) => {
    await _User.findOneAndUpdate(
        { _id },
        {
            $set: {
                ...user,
                'userInfo.avatar': avatar,
            },
        },
        { new: true }
    )
}

module.exports = {
    createUser,
    getUserByEmail,
    verifyEmailByUserId,
    getUserIsNotActivate,
    userInfo,
    createUserByGoggle,
    findUserById,
    administrators,
    getAdministratorDetail,
    customers,
    customerDetail,
    getListLiked,
    addLikedProduct,
    deleteLikedItem,
    deleteAccount,
    updateInfo,
    addLikeProduct,
}
