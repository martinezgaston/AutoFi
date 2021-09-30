const initializer = require('./Initializer')
//const { DataResponse } = require("../../utils/responses");

const csvProcessor = initializer.createCsvStreamProcessor();

console.log("FORK " ,csvProcessor);
csvProcessor.process(process.argv[2], process.argv[3], process.argv[4])