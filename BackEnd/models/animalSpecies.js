const connection = require('../database/db');

module.exports = {
    async insert(name) {
        const result = await connection.query(`INSERT INTO "simulador".animalspecies 
            (name) VALUES ($1)`, [name]);
        
        return result;

    },

    async get(){
        const results = await connection.query(`SELECT * FROM "simulador".animalspecies`);
        return results.rows;
    },

    async getById(id){
        const results = await connection.query(`SELECT * FROM "simulador".animalspecies 
            WHERE id_as = $1`, [id]);
        return results.rows[0];
    },

    async update(id, name){
        const result = await connection.query(`UPDATE "simulador".animalspecies SET 
            name = $2
            WHERE id_as = $1`, [id, name]);
        return result;
    },

    async delete(id){
        const result = await connection.query(`DELETE FROM "simulador".animalspecies 
            WHERE id_as = $1`, [id]);
        return result;
    }
}