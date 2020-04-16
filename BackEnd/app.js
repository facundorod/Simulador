const express = require('express');
const app = express();
const routesIndex = require('./routes/index');
const routesUser = require('./routes/userRoutes');
const cors = require('cors'); // Solucionar encabezados CORS.
const bodyParser = require('body-parser'); // Permite trabajar con el body del req
const errors = require('./middleware/errors'); // Manejo de errores.
app.use(cors()); // Soluciono problemas del CORS.

app.use(bodyParser.urlencoded({ extended: false })); // Permite obtener los parámetros de peticiones
app.use(bodyParser.json()); // Parámetros con formato Json


app.use(routesIndex);
app.use(routesUser);

app.post('/api/as', (req, res) => {
    throw new Error();
})

app.get('/api/*', (req, res) => {
  res.status(404).send('Not Found');
});

app.use(errors);



app.listen(8001);
