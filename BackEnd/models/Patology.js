const connection = require('../database/db');

module.exports = {

    async insert(name, description){
        const result = await connection.query(`INSERT INTO "simulador".patology
            (name, description) 
            VALUES ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "simulador".patology`);
        return results.rows;   
    },

    async getById(id_pat){
        const results = await connection.query(`SELECT * FROM "simulador".patology
            WHERE id_pat = $1`, [id_pat]);
        return results.rows[0];
    },

    async update(id, name, description){
        const result = await connection.query(`UPDATE "simulador".patology SET 
            name = $2,
            description = $3
            WHERE id_pat = $1`, [id, name, description]);
        return result;
    },

    async delete(id){

        const result = await connection.query(`DELETE FROM "simulador".patology
            WHERE id_pat = $1`, [id]);
        return result;
    }

}