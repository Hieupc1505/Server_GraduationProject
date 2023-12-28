const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const xss = require('xss-clean')

const env = require('../configs/env')
const { errorConverter, errorHandler } = require('../middlewares/error')
const { customizeLimiter } = require('../middlewares/rate-limit')
const routeConfig = require('../apis/routes')
const session = require('express-session')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')

module.exports = () => {
    const app = express()

    // set log request
    app.use(morgan('dev'))

    // set security HTTP headers
    app.use(helmet())

    // parse json request body
    app.use(express.json({ limit: '25mb' }))

    // parse urlencoded request body
    app.use(express.urlencoded({ limit: '25mb' }))
    // app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    app.use(xss())
    app.use(mongoSanitize())

    // gzip compression
    app.use(compression())

    //cookie
    app.use(cookieParser())

    app.use(
        session({
            secret: 'session',
            saveUninitialized: true,
            cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
        })
    )

    app.use(passport.initialize())
    app.use(passport.session())

    // set cors blocked resources
    app.use(
        cors({
            origin: 'http://localhost:3000',
            methods: 'GET,POST,PUT,DELETE',
            credentials: true,
        })
    )

    app.options('*', cors())

    // setup limits
    if (env.isProduction) {
        // app.use('/v1/auth', customizeLimiter)
    }

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })

    // api routes
    app.use(env.app.routePrefix, routeConfig)

    // convert error to ApiError, if needed
    app.use(errorConverter)

    // handle error
    app.use(errorHandler)

    app.listen(env.app.port)

    return app
}
