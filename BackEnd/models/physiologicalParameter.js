const connection = require('../database/db');

module.exports = {
    async insert(name, description, label, unit){
        const result = await connection.query(`INSERT INTO "Simulador".physiologicalparameter 
            (name, description, label, unit)
            VALUES ($1, $2, $3, $4)`, [name, description, label, unit]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "Simulador".physiologicalparameter`);
        return results.rows;
    },

    async getById(id){
        const result = await connection.query(`SELECT * FROM "Simulador".physiologicalparameter
            WHERE id_pp = $1`, [id]);
        return result.rows[0];
    },

    async update(id, name, description, label, unit){
        const result = await connection.query(`UPDATE "Simulador".physiologicalparameter SET 
            name = $2, 
            description = $3,
            label = $4,
            unit = $5
            WHERE id_pp = $1`, [id, name, description, label, unit]);
        return result;
    },

    async delete(id){
        const result = await connection.query(`DELETE FROM "Simulador".physiologicalparameter 
            WHERE id_pp = $1`, [id]);
        return result;
    }
}