// const { level } = require('winston')
const createError = require('http-errors')
const data = require('../../utils/address.json')
const { _Address } = require('../models/address')
var that = (module.exports = {
    addLevel1: async (req, res) => {
        const level = data
            .map((item, index) => ({
                name: item.name,
                code: item.code,
                codename: item.codename,
                division_type: item.division_type,
                phone_code: item.phone_code,
                level: 1,
                parents: '' + item.code,
            }))
            .flat()

        // for (let i = 0; i < level.length; i++) {
        //     await _Address.create(level[i])
        // }
        res.status(200).json({
            success: true,
            level,
        })
    },
    getProvince: async (req, res) => {
        const p = await _Address.find({ level: 1 })
        res.status(200).json({
            success: true,
            p,
        })
    },
    getDistricts: async (req, res) => {
        const { province } = req.params
        console.log(province)
        if (!province) throw new createError(400, 'BadRequest')
        const regex = `${province}/`
        const d = await _Address.find({ level: 2, parents: { $regex: new RegExp('^' + regex) } })
        res.status(200).json({
            success: true,
            d,
        })
    },
    getWards: async (req, res) => {
        const { province, districts } = req.params

        if (!province || !districts) throw new createError(400, 'BadRequest')
        const regex = `${province}/${districts}/`
        const w = await _Address.find({ level: 3, parents: { $regex: new RegExp('^' + regex) } })
        res.status(200).json({
            success: true,
            w,
        })
    },
})
