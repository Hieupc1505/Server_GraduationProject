module.exports.getLanguage = function (req) {
    return req.headers['accept-language']
}
