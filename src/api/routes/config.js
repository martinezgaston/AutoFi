const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const { ServerException } = require("../../utils/errors");
const ConfigRouter = Router();
const ConfigMiddleware = require("./config.middleware");

const initializer = require("../../classes/Initializer");
const configHandler = initializer.getConfigHandler();

//this route lets you modfified the accepted columns to store
ConfigRouter.post("", ConfigMiddleware.validate, async (req, res, next) => {
  try {
    await configHandler.updateConfigValues(req.body);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({message: "Config Updated"});
  } catch (e) {
    console.log("ConfigRouter post new config ERROR: ", e);
    res.status(500).send(new ServerException({ message: e.message }));
  }
});

module.exports = ConfigRouter;
