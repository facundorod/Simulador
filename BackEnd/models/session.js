const connection = require('../databases/db');

module.exports = {

    async insert(id_user, id_role){
        const result = await connection.query(`INSERT INTO session 
            (id_user, id_role) 
            VALUES ($1, $2)`, [id_user, id_role]);
        return result;
    },
    
    async get() {
        const results = await connection.query(`SELECT * FROM Session`);
        return results.rows;
    },

    async getById(id_user){
        const result = await connection.query(`SELECT * FROM Session 
            WHERE id_user = $1`, [id_user]);
        return result.rows[0];
    },

    async update(id_user, id_role){
        const result = await connection.query(`UPDATE Session SET
                id_role = $2
            WHERE id_user = $1`, [id_user, id_role]);
        return result;
    },

    async delete(id_user){
        const result = await connection.query(`DELETE FROM Session 
            WHERE id_user = $1`, [id_user]);
        return result;
    }
}