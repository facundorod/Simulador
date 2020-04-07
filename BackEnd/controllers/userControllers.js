const jwt = require('jsonwebtoken');
const expiresIn = 60 * 10; // 10 minutos de validez.
const bd = require('../databases/db');
const body_parser = require('body-parser');
const express = require('express');
const app = express();

app.use(body_parser.json()); // Peticiones application/json
app.use(body_parser.urlencoded({extended:true}));


const createUser = (req, res) => {
  res.send({ status: 'OK', message: 'Usuario creado' });
};

const login = (req, res) => {

  const user = { id: 3 };
  const token = jwt.sign({ user }, 'my_secret_key', { expiresIn });

  res.json({
    token
  });
};

const register = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const e_mail = req.body.e_mail;
  const password = req.body.password;
  const institution = req.body.institution;
  var data = [e_mail, name, surname, password, institution];
  bd.insertUsuario(data);
  console.log(data);

};

const deleteUser = (req, res) => {
  res.send({ status: 'OK', message: 'Usuario eliminado' });
};

const getUsers = (req, res) => {
  req.header('Access-Control-Allow-Origin: *');
  console.log(req.headers);  
  res.send({ status: 'OK', data: [] });
};

const updateUsers = (req, res) => {
  res.send({ status: 'OK', message: 'Usuario actualizado' });
};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUsers,
  login,
  register
};
