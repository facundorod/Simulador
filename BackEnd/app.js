const express = require('express');
const app = express();
const routesUser = require('./routes/userRoutes');
const cors = require('cors'); // Solucionar encabezados CORS.
const bodyParser = require('body-parser'); // Permite trabajar con el body del req
const errors = require('./middleware/errors'); // Manejo de errores.
const environment = require('./env/enviroment');


app.use(cors()); // Soluciono problemas del CORS.

app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json
app.use(routesUser);

app.get('/api/*', (req, res) => {
  res.status(404).send('Not Found');
});

app.use(errors);



app.listen(environment.port);
