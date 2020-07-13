const jwt = require('jsonwebtoken');
const expiresIn = 24 * 60 * 60; // 10 minutos de validez.
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// Errores.
const loginError = require('../errors/loginError');
const generalError = require('../errors/generalError');
const registerError = require('../errors/registerError');
const SECRET_KEY = 'secretkey123456';
// Código de errores en consultas PostgreSQL.
const codesErrors = require('../database/codes');

module.exports = {
    login : (req, res, next) => {
      const userData = {
        email : req.body.email,
        password : req.body.password,
      }
      userModel
        .getById(userData.email)
        .then( data => {
          console.log(data);
          if (data) {
            const resultPassword = bcrypt.compareSync(userData.password, data.password);
            if (resultPassword) {
              const accesToken = jwt.sign({ id: data.id_user }, SECRET_KEY, { expiresIn });
              return res.status(200).json(
                { id_user: data.id_user, 
                  email: data.e_mail,
                  accesToken: accesToken,
                  expiresIn : expiresIn
                });
            } else {
              next(new loginError());
            }
          }
          else {
            next(new loginError());
          }
        })
        .catch( err => {
          next(err);
        })
    },

    register : (req, res, next) => {
      const userData = 
        { 
          email : req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          password: bcrypt.hashSync(req.body.password, salt),
          institution: req.body.institution 
        };

      userModel
        .insert(userData.email, userData.name, userData.surname, userData.password, userData.institution)
        .then( data => {
          if (data) {
            return res.status(200).send("The account has been created");
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
      const userData = 
        { 
          email : req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          password: bcrypt.hashSync(req.body.password),
          institution: req.body.institution 
        };
      userModel 
        .update(userData.email, userData.name, userData.surname, userData.password, userData.institution)
        .then( data => {
          return res.status(200).send("The update has been succesfull")
        })
        .catch( err => {
          next(err);
        })
    },

    delete : (req, res, next) => {
      const id_user = req.body.id_user;
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
