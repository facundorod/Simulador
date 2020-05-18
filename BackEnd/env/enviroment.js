const dotenv = require ('dotenv'); 
dotenv.config (); 
module.exports = {
    port: process.env.PORT,
    host_postgre: process.env.HOST_POSTGRE,
    port_postgre: process.env.PORT_POSTGRE,
    database_postgre: process.env.DATABASE_POSTGRE,
    user_postgre: process.env.USER_POSTGRE,
    password_postgre: process.env.PASSWORD_POSTGRE,
}