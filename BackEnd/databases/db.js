const { Client } = require('pg');
const RegisterError = require('../errors/registerError');
const environment = require('../env/enviroment');


// Conexión a base de datos
const client = new Client({
    host: environment.host_postgre,
    port: environment.port_postgre,
    database: environment.database_postgre,
    user: environment.user_postgre,
    password: environment.password_postgre,
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
