const { Client } = require('pg');
const RegisterError = require('../errors/registerError');
const LoginError = require('../errors/loginError');

// Conexión a base de datos
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'Simulador',
    user: 'postgres',
    password: 'facundo95'
});

client.connect();

// Obtiene todos los usuarios de la base
const getUsers = function (req, res) {
    client.query('SELECT * FROM "Simulator".user', [true])
        .then(resultado => {
            res.send(resultado);
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
        });
}

// Inserta un usuario en la tabla User
const insertUser = (data) => {
    client.query('INSERT INTO "Simulator"."User"(e_mail, name, surname, password, institution) VALUES ($1, $2, $3, $4, $5)', data, (error, result) => {
        if (error) {
            re = new RegisterError();
        } else {
            console.log(result);
        }
    });
    
};



module.exports = {
    getUsers,
    insertUser,
    client
}
