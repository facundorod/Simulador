const express = require('express');
const app = express();
const cors = require('cors'); // Solucionar encabezados CORS.
const bodyParser = require('body-parser'); // Permite trabajar con el body del req
const errors = require('./middleware/errors'); // Manejo de errores.
const environment = require('./env/enviroment');


// Rutas
const medicationRoutes = require('./routes/medicationRoutes');
const arrythmiaRoutes = require('./routes/arrythmiaRoutes');
const userRoutes = require('./routes/userRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const pathologyRoutes = require('./routes/pathologyRoutes');
const animalSpeciesRoutes = require('./routes/animalSpeciesRoutes');

app.use(cors()); // Soluciono problemas del CORS.


// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json
app.use(userRoutes);
app.use(medicationRoutes);
app.use(arrythmiaRoutes);
app.use(scenarioRoutes);
app.use(pathologyRoutes);
app.use(animalSpeciesRoutes);



app.get('/api/*', (req, res) => {
  res.status(404).send('Not Found');
});

app.use(errors);



app.listen(environment.port);
