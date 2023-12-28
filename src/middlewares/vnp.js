const env = require('../configs/env')
const { TmnCode, HashSecret, Url, ReturnUrl } = env.vnp
const moment = require('moment')
const { randomString } = require('../utils/random')
// console.log(vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl);
function sortObject(obj) {
    let sorted = {}
    let str = []
    let key
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key))
        }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
    }
    return sorted
}

function handleData(body) {
    return {
        total: body?.cost && body?.total ? body.cost + body.total : 0,
        local: body?.language || 'vn',
        bankCode: body?.bankCode || 'NCB',
    }
}

var that = (module.exports = {
    createVpnUrl: (req, res, next) => {
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        const keyCode = `${req?.userId}-${randomString(6)}`

        let date = new Date()
        let createDate = moment(date).format('YYYYMMDDHHmmss')

        let ipAddr =
            // req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress

        const data = handleData(req.body)

        let tmnCode = TmnCode
        let secretKey = HashSecret
        let vnpUrl = Url
        // let returnUrl = ReturnUrl
        let orderId = moment(date).format('DDHHmmss')
        // let amount = req.body.amount
        let amount = data.total
        // let bankCode = req.body.bankCode
        let bankCode = data.bankCode

        let locale = data.local

        let currCode = 'VND'
        let vnp_Params = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = tmnCode
        vnp_Params['vnp_Locale'] = locale
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = `${ReturnUrl}/${keyCode}`
        vnp_Params['vnp_IpAddr'] = ipAddr
        vnp_Params['vnp_CreateDate'] = createDate
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode
        }

        vnp_Params = sortObject(vnp_Params)

        let querystring = require('qs')
        let signData = querystring.stringify(vnp_Params, { encode: false })
        let crypto = require('crypto')
        let hmac = crypto.createHmac('sha512', secretKey)
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
        req.body.keyCode = keyCode
        req.url = vnpUrl
        next()
    },
    verifyReturnURL: (req, res, next) => {
        var vnp_Params = req.query

        var secureHash = vnp_Params['vnp_SecureHash']

        delete vnp_Params['vnp_SecureHash']
        delete vnp_Params['vnp_SecureHashType']

        vnp_Params = sortObject(vnp_Params)

        var secretKey = HashSecret

        var querystring = require('qs')
        var signData = querystring.stringify(vnp_Params, { encode: false })
        var crypto = require('crypto')
        var hmac = crypto.createHmac('sha512', secretKey)
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            req.query.isVerify = true
            next()
        } else {
            req.query.isVerify = false
            next() //chữ ký không hợp lệ
        }
    },
})
