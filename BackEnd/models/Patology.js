const connection = require('../database/db');

module.exports = {

    async insert(name, description){
        const result = await connection.query(`INSERT INTO "Simulador".patology
            (name, description) 
            VALUES ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "Simulador".patology`);
        return result.rows;   
    },

    async getById(id_pat){
        const results = await connection.query(`SELECT * FROM "Simulador".patology
            WHERE id_pat = $1`, [id_pat]);
        return results.rows[0];
    },

    async update(id, name, description){
        const result = await connection.query(`UPDATE "Simulador".patology SET 
            name = $2,
            description = $3,
            WHERE id_pat = $1`, [id, name, description]);
        return result;
    },

    async delete(id){

        const result = await connection.query(`DELETE FROM "Simulador".patology
            WHERE id_pat = $1`, [id]);
        return result;
    }

}