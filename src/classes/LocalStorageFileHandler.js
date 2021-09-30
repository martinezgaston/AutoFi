const fs = require('fs')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

/*
    This class implements how the csv is handled in the server
    
*/

class LocalStorageFileHandler {

    //config could have information about how/where to save/read a file
    //ex: config about S3 or Azure Cloud Storage
    constructor(config){
        this.config = config
    }

    read(filePath){
        return fs.createReadStream(filePath)
    }

    async remove(filePath){
        fs.unlink(filePath, (_) => {})

    }

    //middleware to upload file on the server fs
    upload  = upload.single('cardata')
}

module.exports = LocalStorageFileHandler;