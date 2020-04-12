const jwt = require('jsonwebtoken');
const expiresIn = 60 * 10; // 10 minutos de validez.
const bd = require('../databases/db');
const body_parser = require('body-parser');
const express = require('express');
const errorLogin = require('../errors/loginError');
const app = express();

app.use(body_parser.json()); // Peticiones application/json
app.use(body_parser.urlencoded({extended:true}));


const createUser = (req, res) => {
  res.send({ status: 'OK', message: 'Usuario creado' });
};

const login = (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, 'my_secret_key', { expiresIn });
  const e_mail = req.body.e_mail;
  bd.getUserByEmail(e_mail)
  .then(result => {
    if (result == 1 ) {
      res.json({token})
    }
    else {
      err = new errorLogin();
      res.json(err.toJson());
    }
  });
  
};

const register = (req, res) => {
  const data = [req.body.e_mail, req.body.name, req.body.surname, req.body.password, req.body.institution];
  bd.insertUser(data);
};

const deleteUser = (req, res) => {
};

const getUsers = (req, res) => {
  console.log(req.headers);  
  res.send({ status: 'OK', data: [] });
};

const updateUsers = (req, res) => {
};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUsers,
  login,
  register
};
