const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

const COLLECTIONS = ["carData", "updateStatus", "config"];

/*
  Generates the conection to the DB
  Specific implementation for Mongo In memory
*/

class MongoDBManager {
  constructor() {
    this.db = null;
    this.server = null;
    this.connection = null;
    this.isDbConnected = false;
  }

  // Spin up a new in-memory mongo instance
  async start() {

    //it is already started
    if(this.server != null &&
      this.connection != null &&
      this.db != null)  return

    this.server = await MongoMemoryServer.create();
    const url = await this.server.getUri();
    this.connection = await MongoClient.connect(url);
    this.db = this.connection.db("Autofi");
    this.isDbConnected = true;
    console.log("Mongo connected");
  }

  // Close the connection and halt the mongo instance
  stop() {
    this.connection.close();
    return this.server.stop();
  }

  // Remove all documents from the entire database - useful between tests
  cleanup() {
    return Promise.all(
      COLLECTIONS.map((c) => this.db.collection(c).deleteMany({}))
    );
  }
}

const mongoDbManager = new MongoDBManager();
module.exports = mongoDbManager;
