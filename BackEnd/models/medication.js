const connection = require('../database/db');

module.exports = {

    async insert(name, description){
        const result = await connection.query(`INSERT INTO "Simulador".medication
            (name, description)
            VALUES 
            ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "Simulador".medication`);
        return results.rows;
    },

    async getById(id_med){
        const result = await connection.query(`SELECT id_medication, name, description
            FROM "Simulador".medication
            WHERE id_medication = $1`, [id_med]);
        return result.rows[0];
    },

    async update(id_med, name, description){
        const result = await connection.query(`UPDATE FROM "Simulador".medication SET 
            name = $2,
            description = $3
            WHERE id_med = $1`, [id_med, name, description]);
        return result;
    },

    async delete(id_med){
        const result = await connection.query(`DELETE FROM "Simulador".medication 
            WHERE id_medication = $1`, [id_med]);
        return result;
    }
}