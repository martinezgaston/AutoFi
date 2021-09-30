const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const { ServerException } = require("../../utils/errors");
const CsvRouter = Router();

const CsvProcessorMiddleware = require("./csvprocessor.middleware");
const initializer = require("../../classes/Initializer");
const csvProcessor = initializer.createCsvStreamProcessor();

//route to upload a csv, validates 2 inputs and store the csv depending on the implementation of csvProcessor class
CsvRouter.post(
  "/",
  csvProcessor.fileHandler.upload,
  CsvProcessorMiddleware.validateUpdateCsv,
  async (req, res, next) => {
    //this batchId identifies a csv status
    const batchId = uuidv4();

    try {
      csvProcessor.process(req.file.path, req.body.provider_name, batchId);

      res.setHeader("Content-Type", "application/json");
      res.status(200).send({ batchId: batchId });
    } catch (e) {
      console.log("CsvRouter POST ERROR: ", e);
      res.status(500).send(new ServerException({ message: e.message }));
    }
  }
);


module.exports = CsvRouter;
