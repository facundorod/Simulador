const connection = require('../database/db');

module.exports = {
    async insert(id_as, id_pp, id_scenario, t, value){
        const result = await connection.query(`INSERT INTO "simulador".pcurve
            VALUES ($1, $2, $3, $4, $5)`, [id_as, id_pp, id_scenario, t, value]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "simulador".pcurve`);
        return results.rows;
    },

    async getById(id_as, id_pp, id_scenario, t){
        const result = await connection.query(`SELECT * FROM "simulador".pcurve 
            WHERE id_as = $1 AND id_pp = $2
                AND id_scenario = $3 AND t = $4`, [id_as, id_pp, id_scenario, t]);
        return result.rows[0];
    },

    async update(id_as, id_pp, id_scenario, t, value){
        const result = await connection.query(`UPDATE "simulador".pcurve 
            SET value = $1
            WHERE id_as = $2 AND id_pp = $3
            AND id_scenario = $4 AND t = $5`, [value, id_as, id_pp, id_scenario, t]);
        return result;
    },

    async delete(id_as, id_pp, id_scenario, t){
        const result = await connection.query(`DELETE FROM "simulador".pcurve 
            WHERE id_as = $1 AND id_pp = $2 AND id_scenario = $3
                AND t = $4`, [id_as, id_pp, id_scenario, t]);
        return result;
    }
}