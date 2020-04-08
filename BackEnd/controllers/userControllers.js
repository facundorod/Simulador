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
  const e_mail = req.e_mail;
  bd.getUserByEmail(e_mail);
  res.json({
      token
  });
  
};

const register = (req, res) => {
  bd.insertUsuario(req);
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
