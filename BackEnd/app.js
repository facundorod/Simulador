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
const mPerScenarioRoutes = require('./routes/mPerScenarioRoutes');
const pCurveRoutes = require('./routes/pCurveRoutes');
const physiologicalRoutes = require('./routes/physiologicalParameterRoutes');
const ppPerAsRoutes = require('./routes/ppPerAsRoutes');
const roleRoutes = require('./routes/roleRoutes');
const scenarioSimulationRoutes = require('./routes/scenarioPerSimulationRoutes');
const sppRoutes = require('./routes/sppRoutes');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json
app.use(cors()); // Soluciono problemas del CORS.

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
app.use(mPerScenarioRoutes);
app.use(pCurveRoutes);
app.use(physiologicalRoutes);
app.use(ppPerAsRoutes);
app.use(roleRoutes);
app.use(scenarioSimulationRoutes);

// Midlleware para manejo de errores.
app.use(errors); 


app.get('/api/*', (req, res) => {
  res.status(404).send('Not Found');
});



app.listen(environment.port);
