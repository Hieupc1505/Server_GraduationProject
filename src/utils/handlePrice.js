const { utils } = require('../configs/env')

module.exports.handlePrice = (money, lang) => {
    const oth = lang === 'vn' ? 'en' : 'vn'
    const ex = utils.exchangeRate
    return {
        [lang]: money,
        [oth]: oth === 'vn' ? ex * money : Math.ceil(money / ex),
    }
}
