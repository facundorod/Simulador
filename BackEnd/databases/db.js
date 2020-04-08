const { Client } = require('pg');
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'Simulador',
    user: 'postgres',
    password: 'facundo95'
});

client.connect();

const getUsers = function (req, res) {
    client.query('SELECT * FROM "Simulator".user', [true])
        .then(resultado => {
            res.send(resultado);
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
        });
}

const insertUser = (req) => {
    data = [req.e_mail, req.name, req.surname, req.password, req.institution];
    client.query('INSERT INTO "Simulator"."User"(e_mail, name, surname, password, institution) VALUES ($1, $2, $3, $4, $5)', data)
    .then(resultado => {
        console.log(resultado)
    })
    .catch(function(error) {
        console.log("ERROR: ", error)
    });
};

const getUserByEmail = (e_mail) => {

    client.query('SELECT * FROM "Simulator"."User" WHERE e_mail=$1', [e_mail], (error, results) => {
        console.log(results.rows);
    });
}


module.exports = {
    getUsers,
    getUserByEmail,
    insertUser
}
