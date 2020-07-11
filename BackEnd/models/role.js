const connection = require('../database/db');

module.exports = {

    async insert(name) {
        const results = await connection.query(`INSERT INTO "simulador"."role"
            (name)
            VALUES ($1)`, [name]);
        return results;
    },

    async get() {
        const results = await connection.query(`SELECT * FROM "simulador"."role"`);
        return results.rows;
    },

    async getById(id_role){
        const result = await connection.query(`SELECT * FROM "simulador"."role"
            WHERE id_role = $1`, [id_role]);
        return result.rows[0];
    },


    async update(id_role, name){
        const results = await connection.query(`UPDATE "simulador"."role" SET
                name = $2
            WHERE id_role=$1`, [id_role, name]);
        return results;
    },

    async delete(id_role){
        const result = await connection.query(`DELETE FROM "simulador"."role"
            WHERE id_role = $1`, [id_role]);
        return result;
    }

}