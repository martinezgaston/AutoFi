const {
    InputError
} = require('../../utils/errors')

//simple validation middleware
const ConfigMiddleware = {
    validate: async (req, res, next) => {
        if(!req.body)
            return next(new InputError({
                message: "No body sent"
            }))

            if(!req.body.acceptedValues || req.body.acceptedValues.length == 0)
            return next(new InputError({
                message: "acceptedValues must be an array of strings"
            }))


            req.body.acceptedValues.forEach(element => {
                if (!(typeof element === 'string' || element instanceof String))
                return next(new InputError({
                    message: "acceptedValues must be an array of strings"
                }))
            });
           

        next()
    }
    
}

module.exports = ConfigMiddleware;