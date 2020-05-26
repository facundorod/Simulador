// Manejo de errores 
// Recibe todos los errores que se producen - Express manda los errores a esta función
var handleError = (err, req, res, next) => {
  let errorObject;
  console.log("fas");
  if (typeof err.toJson === 'function'){
    errorObject = err.toJson();
  } else {
    errorObject = {
      status: 500,
      name: 'Internal error',
      message: 'Something bad has happened',
    }
  }
  res.status(errorObject.status).json(errorObject.message);
}

module.exports = handleError;