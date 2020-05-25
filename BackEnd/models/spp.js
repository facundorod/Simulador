const connection = require('../databases/db');

module.exports = {
    async insert(id_as, id_pp, id_scenario){
        const result = await connection.query(`INSERT INTO Spp 
            (id_as, id_pp, id_scenario)
            VALUES ($1, $2, $3)`, [id_as, id_pp, id_scenario]);
        return result;

    },

    async get(){
        const results = await connection.query(`SELECT * FROM Spp`);
        return results.rows;
    },

    async getByIdAs(id_as){
        const results = await connection.query(`SELECT * FROM Spp 
            WHERE id_as = $1`, [id_as]);
        return results.rows;
    },

    async getByIdPp(id_pp){
        const results = await connection.query(`SELECT * FROM Spp
            WHERE id_pp = $1`, [id_pp]);
        return results.rows;
    },

    async getByIdScenario(id_scenario){
        const results = await connection.query(`SELECT * FROM Spp 
            WHERE id_scenario = $1`, [id_scenario]);
        return results.rows;
    },

    async updateScenario(id_as, id_pp, id_scenario){
        const result = await connection.query(`UPDATE Spp SET
            id_as = $1,
            id_pp = $2
            WHERE id_scenario = $3`, [id_as, id_pp, id_scenario]);
        return result;
    },

    async updatePP(id_as, id_pp, id_scenario){
        const result = await connection.query(`UPDATE Spp SET
            id_as = $1,
            id_scenario = $2
            WHERE id_pp = $3`, [id_as, id_scenario, id_pp]);
        return result;
    },

    async updateAs(id_as, id_pp, id_scenario){
        const result = await connection.query(`UPDATE Spp SET
            id_pp = $1,
            id_scenario = $2
            WHERE id_as = $3`, [id_pp, id_scenario, id_as]);
        return result;
    },

    async deleteAs(id_as){
        const result = await connection.query(`DELETE FROM Spp
            WHERE id_as = $1`, [id_as]);
        return result;
    },

    async deleteScenario(id_scenario){
        const result = await connection.query(`DELETE FROM Spp
            WHERE id_scenario = $1`, [id_scenario]);
        return result;
    },

    async deletePp(id_pp){
        const result = await connection.query(`DELETE FROM Spp
            WHERE id_pp = $1`, [id_pp]);
        return result;
    }
}