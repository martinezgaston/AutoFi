const { Router } = require("express");
const { ServerException } = require("../../utils/errors");
const BatchRouter = Router();

const initializer = require("../../classes/Initializer");
const batchHandler = initializer.getBatchHandler();

//this route is used to get the status of a csv
BatchRouter.get("/:batchId", async (req, res, next) => {
    try {
      const result = await batchHandler.getStatusById(req.params.batchId);
      res.setHeader("Content-Type", "application/json");
      if (result == null) res.status(404).send();
      else res.status(200).send(result);
    } catch (e) {
      console.log("BatchRouter GET batch ERROR: ", e);
      res.status(500).send(new ServerException({ message: e.message }));
    }
  });
  

module.exports = BatchRouter;
