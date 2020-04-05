const { Client } = require('pg');
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'tesis',
    user: 'postgres',
    password: 'Facundo95'
});

const bd = client.connect();

module.exports.usuarios = function (req, res) {
    bd.query('SELECT * FROM simulador.usuario', [true])
        .then(resultado => {
            res.send(resultado);
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
        });
}

module.exports.insertUsuario = function(datos){
    bd.query('INSERT INTO simulador.usuario(email, nombre, apellido, contraseña) VALUES ($1, $2, $3, $4)', datos)
    .then(resultado => {
        console.log(resultado)
    })
    .catch(function(error) {
        console.log("ERROR: ", error)
    });
};


module.exports.bd = bd;
