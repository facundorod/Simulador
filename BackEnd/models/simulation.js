const connection = require('../database/db');

module.exports = {
    async insert(name, description, id_as){
        const result = await connection.query(`INSERT INTO "Simulador".simulation
            (name, description, id_as)
            VALUES ($1, $2, $3)`, [name, description, id_as]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "Simulador".simulation`);
        return results.rows;
    },

    async getById(id_simulation){
        const result = await connection.query(`SELECT * FROM "Simulador".simulation
            WHERE id_simulation = $1`, [id_simulation]);
        return result.rows[0];
    },

    async update(id_simulation, name, description, id_as){
        const result = await connection.query(`UPDATE "Simulador".simulation SET 
            name = $2,
            description = $3,
            id_as = $4
            WHERE id_simulation = $1`, [id_simulation, name, description, id_as]);
        return result;
    },

    async delete(id_simulation){
        const result = await connection.query(`DELETE FROM "Simulador".simulation
            WHERE id_simulation = $1`, [id_simulation]);
        return result;
    }
}