const { Client } = require('pg');
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'Simulador',
    user: 'postgres',
    password: 'facundo95'
});

client.connect();

module.exports.usuarios = function (req, res) {
    client.query('SELECT * FROM "Simulator".user', [true])
        .then(resultado => {
            res.send(resultado);
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
        });
}

module.exports.insertUsuario = function(data){
    /* client.query('SELECT * FROM "Simulator".ROLE').
    then(resultado => {
        console.log(resultado);
    }); */
    client.query('INSERT INTO "Simulator"."User"(id_user, e_mail, name, surname, password, institution) VALUES (1, $1, $2, $3, $4, $5)', data)
    .then(resultado => {
        console.log(resultado)
    })
    .catch(function(error) {
        console.log("ERROR: ", error)
    });
};


module.exports.bd = client;
