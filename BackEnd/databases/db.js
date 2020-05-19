const environment = require('../env/enviroment');
const { Pool } = require("pg");

const pool = new Pool({
    user: enviroment.user_postgre,
    host: environment.host_postgre,
    database: environment.database_postgre,
    password: environment.password_postgre,
    port: environment.port_postgre,
});


// // Inserta un usuario en la tabla User
// const insertUser = (data) => {
//     client.query('INSERT INTO "Simulator"."User"(e_mail, name, surname, password, institution) VALUES ($1, $2, $3, $4, $5)', data, (error, result) => {
//         if (error) {
//             re = new RegisterError();
//         } else {
//             console.log(result);
//         }
//     });
    
// };


module.exports = pool;