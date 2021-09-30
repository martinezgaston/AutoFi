const dbManager = require("../../src/db/mongoInMemory");
// add here common funtions for testing

module.exports = {

    //waits until the csv finish
    waitFinishStatus: async (batchId)=>{
      let results = await dbManager.db.collection('updateStatus').find({batchId:batchId}).toArray()
      while(results[0].status != "FINISHED"){
        results = await dbManager.db.collection('updateStatus').find({batchId:batchId}).toArray()
      }
  },

}