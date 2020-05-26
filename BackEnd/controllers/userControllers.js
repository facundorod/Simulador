const jwt = require('jsonwebtoken');
const expiresIn = 60 * 10; // 10 minutos de validez.
const userModel = require('../models/user');

// Errores.
const loginError = require('../errors/loginError');
const generalError = require('../errors/generalError');
const registerError = require('../errors/registerError');

// Código de errores en consultas PostgreSQL.
const codesErrors = require('../database/codes');

module.exports = {
    login : (req, res, next) => {
      const { email, password } = req.body;
      let token;
      userModel
        .getCredentials(email, password)
        .then( data => {
          if (data) {
            token = jwt.sign({ email }, password, { expiresIn });
            return res.json(token);
          }
          else {
            next(new loginError());
          }
        })
        .catch( err => {
          console.log(err);
          next(err);
        })
    },

    register : (req, res, next) => {
      const { email, name, surname, password, institution } = req.body;
      userModel
        .insert(email, name, surname, password, institution)
        .then( data => {
          if (data) {
            return res.send("The account has been created");
          }
        })
        .catch( err => {
          if (err.code == codesErrors.UNIQUE_VIOLATION) {
            next(new registerError());
          } else {
            next(err);
          }
        });
    },

    update : (req, res, next) => {
      const { email, name, surname, password, institution, id_user } = req.body;
      userModel 
        .update(id_user, email, name, surname, password, institution)
        .then( data => {
          return res.send("The update has been succesfull")
        })
        .catch( err => {
          console.log(err);
          next(err);
        })
    },

    delete : (req, res, next) => {
      const { id_user } = req.body;
      userModel
        .delete(id_user)
        .then( data => {
          return res.send("The delete has been succesfull");
        })
        .catch( err => {
          console.log(err);
          next(err);
        })
    }
}
