class GeneralError extends Error {
  constructor(
    statusCode,
    errorCode,
    message,
    logMessage,
    name,
    serviceName,
    failedInput
  ) {
    super();
    this.message = message ? message : "General error";
    this.logMessage = logMessage ? logMessage : "General error";
    this.statusCode = statusCode ? statusCode : null;
    this.errorCode = errorCode ? errorCode : null;
    this.name = name ? name : "GeneralError";
    this.serviceName = serviceName ? serviceName : null;
    this.failedInput = failedInput ? failedInput : null;
  }
}



class NotFound extends GeneralError {
  constructor(error) {
    super(
      404,
      error.errorCode,
      "Not found",
      error.logMessage ? error.logMessage : "Not found",
      "NotFound",
      error.serviceName,
      error.failedInput
    );
  }
}

class InputError extends GeneralError {
  constructor(error) {
    super(
      400,
      error.errorCode,
      error.message ? error.message : "Invalid format",
      error.logMessage ? error.logMessage : "Invalid format",
      "InputError",
      error.serviceName,
      error.failedInput
    );
    
  }
}

class ServerException extends GeneralError {
  constructor(error) {
    super(
      500,
      error.errorCode,
      "Internal server error",
      error.logMessage ? error.logMessage : "Internal server error",
      "ServerException",
      error.serviceName,
      error.failedInput
    );
  }
}

function createResponseError(err) {


   if (err.statusCode == 404) {
    return new NotFound(err);
  } else return new ServerException(err);
}

function createErrorObject(err) {
  switch (err.statusCode) {
  
    case 404:
      return new NotFound(err);
    case 500:
      return new ServerException(err);
  }

}

function handleError(error, failedInput, serviceName) {

  if (!error.statusCode) {
    //Server error
   error = new ServerException({
    logMessage: error.stack ? error.stack : error.message,

    });
  }

  error.logMessage = error.logMessage ? error.logMessage : error.message;
  error.failedInput = error.failedInput ? error.failedInput : failedInput;
  error.serviceName = error.serviceName ? error.serviceName : serviceName;

  return error;
}

module.exports = {
  GeneralError,
  NotFound,
  ServerException,
  InputError,
  createResponseError,
  handleError
};