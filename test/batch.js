let chai = require("chai");
const { expect } = require("chai");
let chaiHttp = require("chai-http");
require("dotenv").config();
let server = require("../bin/server");
let app = require("../app");
let dbManager = require("../src/db/mongoInMemory");
chai.use(chaiHttp);

const testDataJson = require('./data/batch.data')

describe("Endpoint /batch", () => {
  beforeEach((done) => {
    if (dbManager.isDbConnected) {
      // set app.isDbConnected when connected.
      process.nextTick(done);
    } else {
      app.on("dbConnected", () => done());
    }
  });

  describe("provides information about the status of a csv prossesing", () => {
    it("return the status and the batchId of a csv process", async () => {
     const testData = testDataJson.newStatus;

     await dbManager.db.collection("updateStatus").insertOne(testData);

      const res = await chai.request(server).get("/batch/" + testData.batchId).send();
      expect(res).to.have.status(200);
      expect(res.body.batchId).to.be.equal(testData.batchId);
      expect(res.body.status).to.be.equal(testData.status);
    });
  });

  it("return a Not Found message when a batch id does not exist", async () => {
    const res = await chai.request(server).get("/batch/1").send();
    expect(res).to.have.status(404);
  });
});
