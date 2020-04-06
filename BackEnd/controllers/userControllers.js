const jwt = require('jsonwebtoken');
const expiresIn = 60 * 10; // 10 minutos de validez.
const bd = require('../databases/db');
const body_parser = require('body-parser');
const express = require('express');
const app = express();

app.use(body_parser.json()); // Peticiones application/json
app.use(body_parser.urlencoded({extended:true}));


const createUser = (req, res) => {
  res.header('Access-Control-Allow-Origin: *');
  res.header(
    'Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  res.send({ status: 'OK', message: 'Usuario creado' });
};

const login = (req, res) => {
  res.header('Access-Control-Allow-Origin: *');
  res.header(
    'Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  const user = { id: 3 };
  const token = jwt.sign({ user }, 'my_secret_key', { expiresIn });

  res.json({
    token
  });
};

const register = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const user = req.body.user;
  const password = req.body.password;
  var datos = [name, surname, user, password];
  bd.insertUsuario(datos);

};

const deleteUser = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.send({ status: 'OK', message: 'Usuario eliminado' });
};

const getUsers = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.send({ status: 'OK', data: [] });
};

const updateUsers = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
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
