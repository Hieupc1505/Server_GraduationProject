const dotenv = require('dotenv')
const path = require('path')

const pkg = require('../../package.json')
const { getOsEnvOptional, getOsEnv, normalizePort, toBool, toNumber } = require('../libs/os')

/**
 * Load .env file or for tests the .env.test, .env.production file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) })

/**
 * Environment variables
 */

const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: pkg.version,
        description: pkg.description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
    },
    database: {
        connection: getOsEnv('DB_CONNECTION'),
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
    passport: {
        jwtToken: getOsEnv('SECRET_JWT_ACCESS'),
        jwtAccessExpired: toNumber(getOsEnv('JWT_ACCESS_EXPIRED')),
        jwtRefreshExpired: toNumber(getOsEnv('JWT_REFRESH_EXPIRED')),
        clientId: getOsEnv('GG_CLIENT_ID'),
        clientSecret: getOsEnv('GG_CLIENT_SECRET'),
        redirectUrl: getOsEnv('GG_REDIRECT_URI'),
        refreshTokenMail: getOsEnv('REFRESHTOKEN_MAIL'),
        mailFrom: getOsEnv('MAIL_FROM'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    client: {
        url: getOsEnv('CLIENT_URL'),
        redirect_gg_verify: getOsEnv('CLIENT_REDIRECT_GG_LOGIN'),
    },
    server: {
        url: getOsEnv('SERVER_URL'),
    },
    jwt: {
        secretAccessToken: getOsEnv('SECRET_JWT_ACCESS'),
        secretRefreshToken: getOsEnv('SECRET_JWT_REFRESH'),
        accessTokenExpired: toNumber(getOsEnv('JWT_ACCESS_EXPIRED')),
        refreshTokenExpired: toNumber(getOsEnv('JWT_REFRESH_EXPIRED')),
    },
    utils: {
        exchangeRate: getOsEnv('EXCHANGE_RATE'),
    },
    vnp: {
        TmnCode: getOsEnv('vnp_TmnCode'),
        HashSecret: getOsEnv('vnp_HashSecret'),
        Url: getOsEnv('vnp_Url'),
        ReturnUrl: getOsEnv('vnp_ReturnUrl'),
    },
    img: {
        CLOUDINARY_NAME: getOsEnv('CLOUDINARY_NAME'),
        CLOUDINARY_API_KEY: getOsEnv('CLOUDINARY_API_KEY'),
        CLOUDINARY_API_SECRET: getOsEnv('CLOUDINARY_API_SECRET'),
    },
}

module.exports = env
