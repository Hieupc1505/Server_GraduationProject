const mongoose = require('mongoose')

const Logger = require('../libs/logger')
const env = require('../configs/env')

const log = new Logger(__filename)

module.exports = async () => {
    try {
        const link = env.node === 'development' ? env.database.dev : env.database.prod
        mongoose.set('strictQuery', false)
        await mongoose.connect(link, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        log.info('Successfully for MongoDB connected!!')
    } catch (err) {
        log.error(`Failed to connect to MongoDB - ${err.message}`)
        throw new Error(`Failed to connect to MongoDB`)
    }
}
