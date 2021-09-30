class BatchHandler{

    constructor(dbstorage){
        this.dbstorage = dbstorage
    }

    async getStatusById(batchId) {
        //returns the status of a processing csv
        const batchStatus = await this.dbstorage.getBatchStatusById(batchId);
        if (batchStatus)
          return {
            batchId: batchStatus.batchId,
            status: batchStatus.status,
          };
        else return null;
      }
}

module.exports = BatchHandler;