const fs = require('fs')
const workingExampleCarData =  fs.createReadStream(global.__basedir + "/test/data/workingExample.data.csv")
const inProviderCollectionData =  fs.createReadStream(global.__basedir + "/test/data/inProviderCollection.data.csv")
const correctRowsData =  fs.createReadStream(global.__basedir + "/test/data/correctRows.data.csv")
const modifiedConfigData =  fs.createReadStream(global.__basedir + "/test/data/modifiedConfig.data.csv")

module.exports ={
    noCSV:{
        provider_name: "test new status 1000"
    },
    noProvider:{
        cardata: "test new status 1000"
    },
    workingExample:{
        provider_name: "this works!",
        cardata: workingExampleCarData
    },
    storedInProviderCollection:{
        provider_name: "new_provider",
        cardata: inProviderCollectionData,
    },
    correctRows: {
        provider_name: "another_provider",
        cardata: correctRowsData,
        path: global.__basedir + "/test/data/correctRows.data.csv",
        rowsQty: 2
    },
    modifiedConfig:{
        provider_name: "modified_provider_config",
        cardata: modifiedConfigData,
        path: global.__basedir + "/test/data/modifiedConfig.data.csv",
        rowsQty: 3,
        newConfig:{
            acceptedValues:[
                'vin'
            ]
        
        }
    }
    
}