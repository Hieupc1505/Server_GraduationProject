const env = require('../configs/env')

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
    orginalError(error) {
        if (error instanceof Error && env.node === 'DEVELOPMENT') {
            this.statusCode = error?.statusCode || 500
            this.message = error?.message || 'INTERNAL_SERVER_ERROR'
            this.stack = error?.stack
        }
        return
    }
}

module.exports = ApiError
