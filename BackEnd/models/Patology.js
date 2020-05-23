const connection = require('../databases/db');

module.exports = {

    async insert(name, description){
        const result = await connection.query(`INSERT INTO Patology
            (name, description) 
            VALUES ($1, $2)`, [name, description]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM Patology`);
        return result.rows;   
    },

    async getById(id_pat){
        const results = await connection.query(`SELECT * FROM Patology
            WHERE id_pat = $1`, [id_pat]);
        return results.rows[0];
    },

    async update(id, name, description){
        const result = await connection.query(`UPDATE Patology SET 
            name = $2,
            description = $3,
            WHERE id_pat = $1`, [id, name, description]);
        return result;
    },

    async delete(id){

        const result = await connection.query(`DELETE FROM Patology
            WHERE id_pat = $1`, [id]);
        return result;
    }

}