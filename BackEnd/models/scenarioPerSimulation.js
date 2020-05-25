const connection = require('../databases/db');

module.exports = {
    async insert(id_scenario, id_simulation){
        const result = await connection.query(`INSERT INTO ScenarioPerSimulation
            (id_scenario, id_simulation)
            VALUES ($1, $2)`, [id_scenario, id_simulation]);
        return result;   
    },

    async get(){
        const result = await connection.query(`SELECT * FROM ScenarioPerSimulation`);
        return result.rows;
    },

    async getByScenario(id){
        const results = await connection.query(`SELECT * FROM ScenarioPerSimulation
            WHERE id_scenario = $1`, [id]);
        return results.rows;
    },

    async getBySimulation(id){
        const results = await connection.query(`SELECT * FROM ScenarioPerSimulation
            WHERE id_simulation = $1`, [id]);
        return results.rows;
    },

    async updateScenario(id_scenario, id_simulation){
        const result = await connection.query(`UPDATE ScenarioPerSimulation SET
            id_scenario = $1
            WHERE id_simulation = $2`, [id_scenario, id_simulation]);
        return result;
    },

    async updateSimulation(id_scenario, id_simulation){
        const result = await connection.query(`UPDATE ScenarioPerSimulation SET
            id_simulation = $1
            WHERE id_scenario = $2`, [id_simulation, id_scenario]);
        return result;
    },

    async deleteSimulation(id_scenario){
        const result = await connection.query(`DELETE FROM ScenarioPerSimulation
            WHERE id_scenario = $1`, [id_scenario]);
        return result;
    },

    async deleteScenario(id_simulation){
        const result = await connection.query(`DELETE FROM ScenarioPerSimulation
            WHERE id_simulation = $1`, [id_simulation]);
        return result;
    }
}