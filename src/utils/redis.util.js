const { getRedis } = require('../loaders/redisLoader')
const { promisify } = require('util')
const createError = require('http-errors')

const redisSetGet = async () => {
    const redisClient = getRedis()

    // Ensure the redis client is ready before promisifying its methods
    if (!redisClient) {
        throw new createError('Redis client is not initialized')
    }

    const setAsync = promisify(redisClient.set).bind(redisClient)
    const getAsync = promisify(redisClient.get).bind(redisClient)
    const delAsync = promisify(redisClient.del).bind(redisClient)

    return {
        setAsync,
        getAsync,
        delAsync,
    }
}

module.exports = redisSetGet
