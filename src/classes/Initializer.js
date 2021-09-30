const DBHandler = require("./DBHandler");
const ConfigHandler = require("./ConfigHandler");
const LocalStorageFileHandler = require("./LocalStorageFileHandler");
const CsvStreamProcessor = require("./CsvStreamProcessor");
const BatchHandler = require("./BatchHandler");
const mongoDbManager = require("../db/mongoInMemory");
require("dotenv").config();

/*
  This class works like a 'factory'
  It should create complex objects as needed
*/

class Initializer {
  createBatchHandler() {
    this.batchHandler = new BatchHandler( new DBHandler(mongoDbManager));
    return this.batchHandler;
  }

  createConfigHandler() {
    this.configHandler = new ConfigHandler(
      mongoDbManager,
      process.env.REFRESH_INTERVAL_SEC
    );
    return this.configHandler;
  }

  createCsvStreamProcessor() {
    this.csvProcessor = new CsvStreamProcessor(
      new LocalStorageFileHandler(),
      new DBHandler(mongoDbManager),
      process.env.MAX_ROWS_PER_REQUEST,
      this.getConfigHandler()
    );
    return this.csvProcessor;
  }

  getCsvStreamProcessor() {
    if (!this.csvProcessor) return this.createCsvStreamProcessor();
    return this.csvProcessor;
  }

  getConfigHandler() {
    if (!this.configHandler) return this.createConfigHandler();

    return this.configHandler;
  }
  getBatchHandler() {
    if (!this.batchHandler) return this.createBatchHandler();

    return this.batchHandler;
  }
}

const initializer = new Initializer();

module.exports = initializer;
