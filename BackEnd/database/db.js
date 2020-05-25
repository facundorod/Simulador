const environment = require('../env/enviroment');
const { Pool } = require("pg");

const pool = new Pool({
    user: environment.user_postgre,
    host: environment.host_postgre,
    database: environment.database_postgre,
    password: environment.password_postgre,
    port: environment.port_postgre,
});



module.exports = pool;