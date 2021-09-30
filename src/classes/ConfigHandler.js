require("dotenv").config();

/*
  This class recibes a connection instance to a Mongo DB
  and a refreshInterval number expressed in minutes to set
  the time interval to get updates on the document that stores 
  the accepted columns to store from the CSV

  It also provides the first version of accepted columns in the constructor

  Modification on the 'config' document will modified the accepted
  collumns to store when the refresh timer start
*/

class ConfigHandler {
  /*
      Stores the DB instance and refresh interval in minutes
      Sets the first version of accepted columns
      Starts the refresh config timer
    */
  constructor(dbInstance, refreshInterval) {
    this.refreshInterval = refreshInterval;
    this.dbInstance = dbInstance;
    this.config = {
      acceptedValues: [
        "uuid",
        "vin",
        "make",
        "mileage",
        "model",
        "year",
        "price",
        "zip code",
        "create date",
        "update date",
      ],
    };
    this.setRefreshInterval();
  }

  /*
    Gets the accepted columns from the 'config' document
    If the document does not exist, it won't use any new configuration
    and use the previous one (already stored)
   */
  async getConfigData() {
    try {
      const config = await this.dbInstance.db
        .collection("config")
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      if (config && config.length > 0) return config[0];
      else return this.config;
    } catch (e) {
      console.error("ConfigHandler getConfigData [ERROR] ", e.message);
    }
  }

  // general method to that should call the existing implementation
  async refresh() {
    this.config = await this.getConfigData();
  }

  async updateConfigValues(newConfig){
    await this.dbInstance.db
        .collection("config")
        .insertOne(newConfig)

    this.config = newConfig
  }

  //returns the existing config
  getConfig() {
    return this.config;
  }

  //calls to setInterval method to set the interval for getting the config from the db
  // converts the this.refreshInterval to seconds
  setRefreshInterval() {
    this.refreshTimerId = setInterval(
      () => this.refresh(),
      this.refreshInterval * 1000
    );
  }

  //stops timer
  stopRefreshInterval() {
    clearInterval(this.refreshTimerId);
  }
}

module.exports = ConfigHandler;
