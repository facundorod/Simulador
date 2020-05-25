const connection = require('../database/db');

module.exports = {
    async insert(id_scenario, id_arr){
        const result = await connection.query(`INSERT INTO "Simulador".arrhythmiaperscenario
            VALUES ($1, $2)`, [id_scenario, id_arr]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM "Simulador".arrhythmiaperscenario`);
        return results.rows;
    },

    async getByIdScenario(id){
        const results = await connection.query(`SELECT * FROM "Simulador".arrhythmiaperscenario 
            WHERE id_scenario = $1`, [id]);
        return results.rows;
    },

    async getByIdArr(id){
        const results = await connection.query(`SELECT * FROM "Simulador".arrhythmiaperscenario
            WHERE id_arr = $1`, [id]);
        return results;
    },

    async updateArr(id_arr, id_scenario){
        const result = await connection.query(`UPDATE "Simulador".arrhythmiaperscenario SET
            id_arr = $1
            WHERE id_scenario = $2`, [id_arr, id_scenario]);
        return result;
    },

    async updateScenario(id_arr, id_scenario){
        const result = await connection.query(`UPDATE "Simulador".arrhythmiaperscenario SET
            id_scenario = $1
            WHERE id_arr = $2`, [id_scenario, id_arr]);
        return result;
    },

    async deleteScenario(id_scenario){
        const result = await connection.query(`DELETE FROM "Simulador".arrhythmiaperscenario
            WHERE id_scenario = $1`, [id_scenario]);
        return result;
    },
    
    async deleteArr(id_arr){
        const result = await connection.query(`DELETE FROM "Simulador".arrhythmiaperscenario
            WHERE id_arr = $1`, [id_arr]);
        return result;
    },
}