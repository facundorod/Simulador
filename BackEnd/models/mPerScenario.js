const connection = require('../databases/db');

module.exports = {
    async insert(id_scenario, id_medication, dose, unit){
        const result = await connection.query(`INSERT INTO MperScenario
            VALUES ($1, $2, $3, $4)`, [id_scenario, id_medication, dose, unit]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM MperScenario`);
        return results.rows;
    },

    async getById(id_scenario, id_medication){
        const result = await connection.query(`SELECT * FROM MperScenario
            WHERE id_scenario = $1 AND id_medication = $2`, [id_scenario, id_medication]);
        return result.rows[0];
    },

    async update(id_scenario, id_medication, dose, unit){
        const result = await connection.query(`UPDATE MperScenario SET
            dose = $1,
            unit = $2
            WHERE id_scenario = $3 AND id_medication = $4`, [dose, unit, id_scenario, id_medication]);
            return result;
    },

    async delete(id_scenario, id_medication){
        const result = await connection.query(`DELETE FROM MperScenario 
            WHERE id_scenario = $1 AND id_medication = $2`, [id_scenario, id_medication]);
        return result;
    }
}