const connection = require('../database/db');

module.exports = {
    async insert(id_scenario, id_pat){
        const result = await connection.query(`INSERT INTO "simulador".patologyperscenario 
            (id_scenario, id_pat)
            VALUES ($1, $2)`, [id_scenario, id_pat]);
        return result;
    },


    async getByIdScenario(id_scenario){
        const results = await connection.query(`SELECT * FROM "simulador".patologyperscenario
            WHERE id_scenario = $1`, [id_scenario]);
        return result.rows;
    },

    async getByIdPatology(id_pat){
        const results = await connection.query(`SELECT * FROM "simulador".patologyperscenario
            WHERE id_pat = $1`, [id_pat]);
        return results.rows;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "simulador".patologyperscenario`);
        return results.rows;
    },

    async updateScenario(id_scenario, id_pat){
        const results = await connection.query(`UPDATE "simulador".patologyperscenario SET 
            id_scenario = $1
            WHERE id_pat = $2`, [id_scenario, id_pat]);
        return results;
    },

    async updatePatology(id_pat, id_scenario){
        const result = await connection.query(`UPDATE "simulador".patologyperscenario SET
            id_pat = $1
            WHERE id_scenario = $2`, [id_pat, id_scenario]);
        return result;
    },
    
    async deleteScenario(id_scenario){
        const result = await connection.query(`DELETE FROM "simulador".patologyperscenario 
            WHERE id_scenario = $1`, [id_scenario]);
        return result;
    },

    async deletePatology(id_pat){
        const result = await connection.query(`DELETE FROM "simulador".patologyperscenario
            WHERE id_pat = $1`, [id_pat]);
        return result;
    }
}