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
        throw res.json(new errorLogin().message);
      } else {
        const token = jwt.sign({ user }, password, { expiresIn });
        return res.json(token);
      }
    })
    .catch(err => {
      return new errorLogin().message;
    });
};

const register = (req, res) => {
  const data = [req.body.e_mail, req.body.name, req.body.surname, req.body.password, req.body.institution];
  bd.client.query('INSERT INTO "Simulator"."User"(e_mail, name, surname, password, institution) VALUES ($1, $2, $3, $4, $5)', data)
    .then(result => {
      return res.json("The account has been created");
    })
    .catch( err => {
      return res.send(new registerError().message);
    })
};

const getUsers = (req, res) => {
  console.log(req.headers);
  res.send({ status: 'OK', data: [] });
};

module.exports = {
  getUsers,
  login,
  register
};
