const status = require('http-status')

const catchAsync = require('../../utils/catch-async')
const { authService, tokenService, userService, emailService, cartService, productService } = require('../services')
const env = require('../../configs/env')
const { authUserToken, authAdmin } = require('../../middlewares/authToken')
const validate = require('../../middlewares/validate')
const { authValidation } = require('../validations')
const { getLanguage } = require('../../utils/getLanguage')
const { uploadSingleImage } = require('../../utils/cloudinary.utils')
const createError = require('http-errors')
const { getRedis } = require('../../loaders/redisLoader')

const register = [
    validate(authValidation.registerSchema),
    catchAsync(async (req, res) => {
        const account = await userService.getUserIsActivate(req.body.email)

        if (account) {
            return new createError(400, 'Bad Request')
        }

        let user = await userService.getUserIsNotActivate(req.body.email)
        if (!user) {
            user = await userService.createUser(req.body)
        }
        const tokens = await tokenService.generateAuthTokens(user)
        const url = `${env.client.url}/activate?token=${tokens.access}`
        await emailService.sendEmail(user.email, 'Y&M SHOP', 'Register', url)
        res.status(200).json({
            success: true,
            element: {},
            meta: {
                url,
            },
        })
    }),
]
const login = [
    validate(authValidation.loginSchema),
    catchAsync(async (req, res) => {
        const { email, password } = req.body

        const user = await authService.loginUserWithEmailAndPassword(email, password)
        const { access } = await tokenService.generateAuthTokens(user)

        res.status(status.OK).json({
            success: true,
            element: {
                tokens: access,
            },
            message: null,
            meta: null,
        })
    }),
]
const logout = [
    validate(authValidation.logoutSchema),
    catchAsync(async (req, res) => {
        await authService.logout(req?.cookies)
        res.clearCookie('_cookie')
        res.status(200).json({
            success: true,
        })
    }),
]
const getUserInfo = [
    authUserToken,
    validate(authValidation.getUserInfo),
    catchAsync(async (req, res) => {
        const user = await userService.userInfo(req.userId)
        const { access, refresh } = await tokenService.generateAuthTokens(user)

        res.cookie('_cookie', refresh, {
            httpOnly: true,
            maxAge: refresh.expires,
        })
        res.status(status.OK).json({
            success: true,
            element: {
                user,
            },
        })
    }),
]
const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken)
    res.status(status.OK).json(tokens)
})
const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
    res.status(status.NO_CONTENT).send()
})
const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password)
    res.status(status.NO_CONTENT).send()
})
const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user)
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken)
    res.status(status.NO_CONTENT).send()
})
const verifyEmail = [
    validate(authValidation.activeSendMail),
    catchAsync(async (req, res) => {
        await authService.verifyEmail(req.query.token)
        res.status(status.NO_CONTENT).send()
    }),
]

const getLikedProducts = [
    authUserToken,
    catchAsync(async (req, res) => {
        const lang = getLanguage(req)

        const liked = await userService.getListLiked(req.userId)
        const products = await Promise.all(liked.map((item) => productService.getProductById(item)))
        const result = productService.convertProductFollowByLanguage(products, lang)

        return res.status(200).json({
            success: true,
            element: {
                products: result,
            },
        })
    }),
]

const addLikedProduct = [
    authUserToken,
    catchAsync(async (req, res) => {
        await userService.addLikedProduct(req.userId, req.body.productId)
        return res.status(200).json({
            success: true,
        })
    }),
]

const deleteLiked = [
    authUserToken,
    catchAsync(async (req, res) => {
        await userService.deleteLikedItem(req.userId, req.body.productId)
        return res.status(200).json({
            success: true,
        })
    }),
]

const deleteAccount = [
    catchAsync(async (req, res) => {
        await userService.deleteAccount(req.body.id)
        return res.status(200).json({
            success: true,
        })
    }),
]

const updateInfo = [
    authAdmin,
    catchAsync(async (req, res) => {
        let link = req.body?.now || ''
        if (req.body.avatar) link = await uploadSingleImage(req.body.avatar, 'avatar')
        await userService.updateInfo(req.body.id, JSON.parse(req.body.user), link)
        return res.status(200).json({
            success: true,
        })
    }),
]

const updateUserInfo = [
    authUserToken,
    catchAsync(async (req, res) => {
        let link = req.body.now
        if (!!req.body.avatar) link = await uploadSingleImage(req.body.avatar, 'avatar')
        await userService.updateInfo(req.userId, req.body.data, link)
        return res.status(200).json({
            success: true,
        })
    }),
]

const testRedis = catchAsync(async (req, res) => {
    const redisClient = getRedis()
    const v1 = await redisClient.get('667d978c1c645c5606e25549')

    res.status(200).json({
        success: true,
        mess: 'had change',
        v1,
        v2: await redisClient.get('667d978c1c645c5606e25549'),
    })
})

module.exports = {
    testRedis,
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    getUserInfo,
    getLikedProducts,
    addLikedProduct,
    deleteLiked,
    deleteAccount,
    updateInfo,
    updateUserInfo,
}
