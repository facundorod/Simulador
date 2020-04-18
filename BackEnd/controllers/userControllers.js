const jwt = require('jsonwebtoken');
const expiresIn = 60 * 10; // 10 minutos de validez.
const bd = require('../databases/db');
const errorLogin = require('../errors/loginError');
const registerError = require('../errors/registerError');


const login = (req, res) => {
  const user = { e_mail: req.body.e_mail };
  const e_mail = req.body.e_mail;
  const password = req.body.password;
  bd.client.query('SELECT * FROM "Simulator"."User" WHERE e_mail=$1 AND password=$2', [e_mail, password])
    .then(result => {
      if (result.rowCount === 0) {
        res.status(402).send(new errorLogin().toJson());
      } else {
        const token = jwt.sign({ user }, password, { expiresIn });
        res.json(token);
      }
    });
};

const register = (req, res) => {
  const data = [req.body.e_mail, req.body.name, req.body.surname, req.body.password, req.body.institution];
  bd.client.query('INSERT INTO "Simulator"."User"(e_mail, name, surname, password, institution) VALUES ($1, $2, $3, $4, $5)', data)
    .then(result => {
      res.json("The account has been created");
    })
    .catch( err => {
      res.status(402).send(new registerError().message);
    })
};


module.exports = {
  login,
  register
};
