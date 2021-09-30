// const sequelize = require("../db/sqliteInMemory");
// const models = require("../models/index")(sequelize);

/*
  This class recibes a connection instance to a Mongo DB
  and a Config Handler instance
  This class should act as an interface to a DB
*/

class DBHandler {
  constructor(dbManager) {
    this.dbManager = dbManager;
  }

  //saves a row to db
  async saveIntoDatabase(rowArray, provider) {
    //writes to db in bulk
    this.dbManager.db.collection(provider).bulkWrite(rowArray);
  }


  //use for debuging - show everything from the collections carData and updateStatus
  async showResume() {
    // const carData = await this.dbManager.db
    // .collection("carData")
    // .find({})
    // .toArray();

    const updateStatus = await this.dbManager.db
      .collection("updateStatus")
      .find({})
      .toArray();

    console.log("Collection updateStatus: ", updateStatus);
    // console.log("Collection carData: " , carData)
  }
  /*
    stores in document 'updateStatus' the name of the provider
    the batchId to query the status of the upload
    the starting status...
  */

  async saveNewUpload(provider, batchId) {
    const newUploadStatus = {
      provider: provider,
      batchId: batchId,
      status: "PROCESSING",
    };
    this.dbManager.db.collection("updateStatus").insertOne(newUploadStatus);
  }

  /*
    updates the status of a document
    depending on the provider and batchId
  */

  async updateStatus(provider, status, batchId) {
    this.dbManager.db.collection("updateStatus").updateOne(
      {
        batchId: batchId,
        provider: provider,
      },
      {
        $set: {
          status: status,
        },
      }
    );

  }

  //gets the status based in a batchId
  async getBatchStatusById(id) {
    const status = await this.dbManager.db.collection("updateStatus").findOne({
      batchId: id,
    });
    return status;
  }
}

module.exports = DBHandler;
