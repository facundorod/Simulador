const connection = require('../databases/db');

module.exports = {

    async insert(name, description){
        const result = await connection.query(`INSERT INTO Medication
            (name, description)
            VALUES 
            ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM Medication`);
        return results.rows;
    },

    async getById(id_med){
        const result = await connection.query(`SELECT id_medication, name, description
            FROM Medication
            WHERE id_medication = $1`, [id_med]);
        return result.rows[0];
    },

    async update(id_med, name, description){
        const result = await connection.query(`UPDATE FROM Medication SET 
            name = $2,
            description = $3
            WHERE id_med = $1`, [id_med, name, description]);
        return result;
    },

    async delete(id_med){
        const result = await connection.query(`DELETE FROM Medication 
            WHERE id_medication = $1`, [id_med]);
        return result;
    }
}