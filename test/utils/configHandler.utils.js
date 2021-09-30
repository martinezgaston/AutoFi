const configHandler = require('../../src/classes/Initializer').getConfigHandler()
// add here common funtions for testing

module.exports = {

  updateAcceptedColumns: async (newConfig)=>{
    await configHandler.updateConfigValues(newConfig)

  }
}