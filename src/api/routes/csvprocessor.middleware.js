const {
    InputError
} = require('../../utils/errors')

//simple validation middleware
const CsvProcessorMiddleware = {
    validateUpdateCsv: async (req, res, next) => {
        if(!req.body.provider_name)
            return next(new InputError({
                message: "No provider sent"
            }))

        if(!req.file)
            return next(new InputError({
                message: "No cardata file sent"
            }))

        next()
    }
    
}

module.exports = CsvProcessorMiddleware;