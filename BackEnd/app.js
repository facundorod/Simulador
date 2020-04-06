const express = require('express');
const app = express();
const routesIndex = require('./routes/index');
const routesUser = require('./routes/userRoutes');
const bd = require('./databases/db');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json

app.use(routesIndex);
app.use(routesUser);
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(8001);
