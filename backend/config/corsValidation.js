const allowedOrigins = require('./allowedOrigins.js')

const corsValidation = {
    origin : ( origin, callback ) => {
        if( allowedOrigins.includes(origin) !== -1 || !origin ) {
            callback( null, true )
        } else {
            callback( new Error('CORS policy does not allow access.') )
        }
    }
}

module.exports = corsValidation