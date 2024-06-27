const redis = require('redis')
const createError = require('http-errors')
const Logger = require('../libs/logger')
const log = new Logger(__filename)
const env = require('../configs/env')

const redisConnect = {
    production: {
        url: `redis://${env.redis.HOST_NAME}:6379`,
    },
    development: {
        host: env.redis.HOST_NAME,
        port: 6379,
    },
}

let client = {},
    statusConnectRedis = {
        CONNECT: 'connect',
        END: 'end',
        RECONNECT: 'reconnecting',
        ERROR: 'error',
    },
    connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000,
    REDIS_CONNECT_MESSAGE = {
        code: -99,
        message: {
            vn: 'Redis connect is fail',
            en: 'Service connect error',
        },
    }
const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new createError(500, REDIS_CONNECT_MESSAGE.message.en)
    }, REDIS_CONNECT_TIMEOUT)
}
const handleEventConnection = ({ connectionRedis }) => {
    //check if connection is null
    connectionRedis.connect()
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        log.info(`connectionRedis - Connection status: connected`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        log.info(`ConenctionRedis - Connection status: disconnect`)
        handleTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        log.info(`ConenctionRedis - Connection status: reconnect`)
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        log.error(`ConenctionRedis - Connection status: error ${err}`)
        handleTimeoutError()
    })
}

const initRedis = async () => {
    const instanceRedis = redis.createClient(redisConnect[env.node])
    client.instanceConnect = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis,
    })
}

const getRedis = () => client.instanceConnect

const closeRedis = () => {}

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
}
