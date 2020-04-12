const { Client } = require('pg');
const RegisterError = require('../errors/registerError');


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
            console.log(error);
            re = new RegisterError();
            console.log(re);
        } else {
            console.log(result);
        }
    });
    
};

// Obtiene un usuario según un email
const getUserByEmail = async (e_mail) => {
    const response = await client.query('SELECT * FROM "Simulator"."User" WHERE e_mail=$1', [e_mail]);
    const row = response.rowCount;
    return row;
}


module.exports = {
    getUsers,
    getUserByEmail,
    insertUser
}
