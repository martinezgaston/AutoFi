 class GeneralResponse {
  constructor(data = null) {
    if(data != null){
      //this maps the response directly to the body, without intermediate attributes
      Object.entries(data).forEach((entry) =>{
        this[entry[0]] = entry[1];
      })
    }
  
  }
}

class DataResponse extends GeneralResponse {}
class ValidationResponse extends GeneralResponse {
  constructor(status,message){
    super(null);
    this.message = message;
    this.status = status;
  }
}

module.exports = {
  GeneralResponse,
  DataResponse,
  ValidationResponse
};
