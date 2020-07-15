const connection = require('../database/db');

module.exports = {

    async insert(e_mail, name, surname, password, institution) {
        const results = await connection.query(`INSERT INTO "simulador"."User"
            (e_mail, name, surname, password, institution)
            VALUES ($1, $2, $3, $4, $5)`, [e_mail, name, surname, password, institution]);
        return results;
    },

    async get() {
        const results = await connection.query(`SELECT * FROM "simulador"."User"`);
        return results.rows;
    },

    async getById(email){
        console.log(email);
        const result = await connection.query(`SELECT * FROM "simulador".User
            WHERE e_mail = $1`, [email]);
        console.log(result);
        return result.rows[0];
    },

    async getCredentials(email, password){
       const result = await connection.query(`SELECT * FROM "simulador"."User"
            WHERE e_mail = $1 AND password = $2`, [email, password]);
        return result.rows[0]; 
    }, 

    async update(e_mail, name, surname, password, institution){
        const results = await connection.query(`UPDATE "simulador"."User" SET
                name = $2, 
                surname = $3,
                password = $4,
                institution = $5
            WHERE e_mail=$1`, [e_mail, name, surname, password, institution]);
        return results;
    },

    async delete(id_user){
        const result = await connection.query(`DELETE FROM "simulador"."User"
            WHERE id_user = $1`, [id_user]);
        return result;
    }

}