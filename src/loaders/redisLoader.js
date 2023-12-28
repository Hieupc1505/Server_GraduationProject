const Redis = require('ioredis')
const Logger = require('../libs/logger')

const log = new Logger(__filename)

// const client = new Redis({
//     host: "rediSearch",
//     port: 6379,
// });
// const client = new Redis(6379, "rediSearch");
let client = null

if (!client) {
    client = new Redis()

    // client.connect();

    client.ping(function (err, result) {
        log.info(result)
    })

    client.on('connect', () => {
        log.info('Redis client connected with URL docker default')
    })

    client.on('error', (error) => {
        log.error(error)
        throw new Error('Have an errror when connect to redis!!')
    })
}

module.exports = client
