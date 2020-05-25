const connection = require('../database/db');

module.exports = {
    async insert(id_scenario, id_simulation){
        const result = await connection.query(`INSERT INTO "Simulador".scenariopersimulation
            (id_scenario, id_simulation)
            VALUES ($1, $2)`, [id_scenario, id_simulation]);
        return result;   
    },

    async get(){
        const result = await connection.query(`SELECT * FROM "Simulador".scenariopersimulation`);
        return result.rows;
    },

    async getByScenario(id){
        const results = await connection.query(`SELECT * FROM "Simulador".scenariopersimulation
            WHERE id_scenario = $1`, [id]);
        return results.rows;
    },

    async getBySimulation(id){
        const results = await connection.query(`SELECT * FROM "Simulador".scenariopersimulation
            WHERE id_simulation = $1`, [id]);
        return results.rows;
    },

    async updateScenario(id_scenario, id_simulation){
        const result = await connection.query(`UPDATE "Simulador".scenariopersimulation SET
            id_scenario = $1
            WHERE id_simulation = $2`, [id_scenario, id_simulation]);
        return result;
    },

    async updateSimulation(id_scenario, id_simulation){
        const result = await connection.query(`UPDATE "Simulador".scenariopersimulation SET
            id_simulation = $1
            WHERE id_scenario = $2`, [id_simulation, id_scenario]);
        return result;
    },

    async deleteSimulation(id_scenario){
        const result = await connection.query(`DELETE FROM "Simulador".scenariopersimulation
            WHERE id_scenario = $1`, [id_scenario]);
        return result;
    },

    async deleteScenario(id_simulation){
        const result = await connection.query(`DELETE FROM "Simulador".scenariopersimulation
            WHERE id_simulation = $1`, [id_simulation]);
        return result;
    }
}