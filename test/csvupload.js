let chai = require("chai");
const { expect } = require("chai");
let chaiHttp = require("chai-http");
require("dotenv").config();
process.env.REFRESH_INTERVAL_SEC = 40;
let server = require("../bin/server");
let app = require("../app");
const dbManager = require("../src/db/mongoInMemory");
chai.use(chaiHttp);
const csv = require("csv-parser");
const testDataJson = require("./data/csvprocessor.data");
const fs = require("fs");
const dbUtils = require("./utils/db.utils");
const configHandlerUtils = require("./utils/configHandler.utils");

describe("Endpoint /upload-csv", () => {
  beforeEach((done) => {
    if (dbManager.isDbConnected) {
      // set app.isDbConnected when connected.
      process.nextTick(done);
    } else {
      app.on("dbConnected", () => done());
    }
  });

  describe("providers send a csv in form-data with their name", () => {
    it("returns a batchId", async () => {
      const testData = testDataJson.workingExample;
      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("provider_name", testData.provider_name)
        .field("cardata", testData.cardata);

      const re = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      );
      expect(res).to.have.status(200);

      expect(re.test(res.body.batchId)).to.be.equal(true);
    });

    it("stores the csv rows correctly", async () => {
      const testData = testDataJson.correctRows;
      const numRows = testData.rowsQty;

      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("provider_name", testData.provider_name)
        .field("cardata", testData.cardata);

      const batchId = res.body.batchId;
      await dbUtils.waitFinishStatus(batchId);

      const docs = await dbManager.db
        .collection(testData.provider_name)
        .find({})
        .toArray();

      expect(docs.length).to.be.equals(numRows);


      let i = 0;
      fs.createReadStream(testData.path)
        .pipe(
          csv({
            mapHeaders: ({ header, index }) => header.toLowerCase(),
          })
        )
        .on("data", (row) => {
          expect(row.vin).to.be.equals(docs[i].vin);
          i++;
        });
      expect(res).to.have.status(200);
    });

    it("stores only the accepted columns", async () => {
      const testData = testDataJson.modifiedConfig;
      const numRows = testData.rowsQty;
      const newConfig = testData.newConfig;

      //this will modified the accepted columns before sending the test csv
      //it should store only the vin field
      await configHandlerUtils.updateAcceptedColumns(newConfig);

      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("provider_name", testData.provider_name)
        .field("cardata", testData.cardata);

      const batchId = res.body.batchId;
      await dbUtils.waitFinishStatus(batchId);


      const docs = await dbManager.db
        .collection(testData.provider_name)
        .find({})
        .toArray();

      expect(docs.length).to.be.equals(numRows);


      let i = 0;
      fs.createReadStream(testData.path)
        .pipe(
          csv({
            mapHeaders: ({ header, index }) => header.toLowerCase(),
          })
        )
        .on("data", (row) => {
          expect(row.vin).to.be.equals(docs[i].vin);
          expect(docs[i].uuid).to.be.equals(undefined);
          i++;
        });
      expect(res).to.have.status(200);
    });

    it("stores the csv rows in 'provider_name' collection", async () => {
      const testData = testDataJson.storedInProviderCollection;
      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("provider_name", testData.provider_name)
        .field("cardata", testData.cardata);

      const batchId = res.body.batchId;
      await dbUtils.waitFinishStatus(batchId);
      const collections = await dbManager.db
        .listCollections({ name: testData.provider_name })
        .toArray();
      expect(collections[0].name).to.be.eqls(testData.provider_name);
      expect(res).to.have.status(200);
    });

    it("returns 400, provider_name is mandatory", async () => {
      const testData = testDataJson.noProvider;

      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("cardata", testData.cardata);

      expect(res).to.have.status(400);
      expect(res.body.description).to.be.equals("No provider sent");
    });

    it("returns 400, cardata is mandatory", async () => {
      const testData = testDataJson.noCSV;

      const res = await chai
        .request(server)
        .post("/upload-csv")
        .set("content-type", "multipart/form-data")
        .field("provider_name", testData.provider_name);

      expect(res).to.have.status(400);
      expect(res.body.description).to.be.equals("No cardata file sent");
    });

   
  });
});
