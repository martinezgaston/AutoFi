const csv = require("csv-parser");

/*
  This class implements the csv processing as a steam
  fileHandler -> where/how to store/read csv's
  dbstorage -> db handler to interface with the current db instance
  maxRowsPerRequest -> how many rows are stored in memory before sending them to db
*/

class CsvStreamProcessor {
  constructor(fileHandler, dbstorage, maxRowsPerRequest, configHandler) {
    this.fileHandler = fileHandler;
    this.dbstorage = dbstorage;
    this.maxRowsPerRequest = maxRowsPerRequest;
    this.configHandler = configHandler;
  }
  //general method to call the current process
  //this should be clearer with interfaces
  async process(filePath, provider, batchId) {
    this.processStream(filePath, provider, batchId);
  }

  async processStream(filePath, provider, batchId) {

    //sets the accepted columns for this process
    const allowedKeys = this.configHandler.getConfig().acceptedValues;
    //first sets the state to PROCESSING
    await this.dbstorage.saveNewUpload(provider, batchId);
    let rowArray = [];

    this.fileHandler
      .read(filePath)
      .pipe(
        csv({
          //this is only for easiness
          mapHeaders: ({ header, index }) => header.toLowerCase(),
        })
      )
      .on("headers", (headers) => {
        //console.log("headers", headers);
      })
      .on("data", async (data) => {
        //sends rows to 'dbstorage' or push new rows until maxRowsPerRequest

        //filters the columns
        const newRowData = this.mapRowToData(data, allowedKeys)
        if(newRowData){
          if (rowArray.length == this.maxRowsPerRequest) {
            this.dbstorage.saveIntoDatabase(rowArray, provider);
            rowArray = [];
          } else rowArray.push(newRowData);
        }
       
      })
      .on("end", async () => {
        // store remaining rows and remove file from server
        // since this 'fileHandler' uses server storage it is better to remove the file
        // another 'fileHandler' may leave the file in S3 for example
        if (rowArray.length > 0)
          await this.dbstorage.saveIntoDatabase(rowArray, provider);

        this.fileHandler.remove(filePath);
        this.dbstorage.updateStatus(provider, "FINISHED", batchId);
      })
      .on("error", (err) => {
        // I should have an 'error policy' here
        // Like storing the 'rowArray' in another file with the failed rows
        // for reprocessing purposes
        console.log("ERROR:", err);
      });
  }

  //returns the row filtered by the configHandler config accepted columns
  mapRowToData(row, allowedKeys) {
    const filtered = Object.keys(row)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: row[key],
        };
      }, {});

    if(!filtered || Object.keys(filtered).length == 0)
      return null;

    return { insertOne: { ...filtered } };
  }

}

module.exports = CsvStreamProcessor;
