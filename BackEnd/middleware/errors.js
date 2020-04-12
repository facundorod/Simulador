// Manejo de errores
const middleware = (err, req, res, next) => {
let errorObject;

  if (typeof err.toJson === 'function'){
    errorObject = err.toJson();
  } else {
    errorObject = {
      status: 500,
      name: 'Unknown error',
      message: 'Unkown error',
    }
  }
  res.status(errorObject.status).json(errorObject);
}

module.exports = middleware;