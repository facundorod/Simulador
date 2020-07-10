const express = require('express');
const app = express();
const cors = require('cors'); // Solucionar encabezados CORS.
const bodyParser = require('body-parser'); // Permite trabajar con el body del req.
const errors = require('./middleware/errors'); // Manejo de errores.
const environment = require('./env/enviroment'); // Variables de ambiente.


// Rutas
const medicationRoutes = require('./routes/medicationRoutes');
const arrythmiaRoutes = require('./routes/arrythmiaRoutes');
const userRoutes = require('./routes/userRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const pathologyRoutes = require('./routes/pathologyRoutes');
const animalSpeciesRoutes = require('./routes/animalSpeciesRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const arrythmiaperScenarioRoutes = require('./routes/arrhythmiaPerScenarioRoutes');
app.use(cors()); // Soluciono problemas del CORS.


// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json

// Routes
app.use(userRoutes);
app.use(medicationRoutes);
app.use(arrythmiaRoutes);
app.use(scenarioRoutes);
app.use(pathologyRoutes);
app.use(animalSpeciesRoutes);
app.use(simulationRoutes);
app.use(sessionRoutes);
app.use(arrythmiaperScenarioRoutes);

// Midlleware para manejo de errores.
app.use(errors); 


app.get('/api/*', (req, res) => {
  res.status(404).send('Not Found');
});



app.listen(environment.port);
