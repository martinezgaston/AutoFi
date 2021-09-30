const { Router } = require("express");
const routes = Router();
const CsvRouter = require('./csvprocessor')
const BatchHandlerRouter = require('./batch')
const ConfigRouter = require('./config')

routes.use("/upload-csv", CsvRouter);
routes.use("/config", ConfigRouter);
routes.use("/batch", BatchHandlerRouter);

module.exports = routes;
