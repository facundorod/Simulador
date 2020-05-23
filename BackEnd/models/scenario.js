const connection = require('../databases/db');

module.exports = {
    async insert(name, description){
        const result = await connection.query(`INSERT INTO Scenario 
            (name, description)
            VALUES ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM Scenario`);
        return results.rows[0];
    },

    async getById(id){
        const result = await connection.query(`SELECT * FROM Scenario 
            WHERE id_scenario = $1`, [id]);
        return result.rows[0];
    },

    async update(id, name, description){
        const result = await connection.query(`UPDATE Scenario SET
            name = $1, 
            description = $2
            WHERE id_scenario = $3`, [name, description, id]);
        return result;
    },

    async delete(id){
        const result = await connection.query(`DELETE FROM Scenario 
            WHERE id_scenario = $1`, [id]);
        return result;
    }
}