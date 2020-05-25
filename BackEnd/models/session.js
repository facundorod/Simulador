const connection = require('../database/db');

module.exports = {

    async insert(id_user, id_role){
        const result = await connection.query(`INSERT INTO "Simulador".sesion 
            (id_user, id_role) 
            VALUES ($1, $2)`, [id_user, id_role]);
        return result;
    },
    
    async get() {
        const results = await connection.query(`SELECT * FROM Session`);
        return results.rows;
    },

    async getByIdUser(id_user){
        const result = await connection.query(`SELECT * FROM Session 
            WHERE id_user = $1`, [id_user]);
        return result.rows;
    },

    async getByIdRole(id_role){
        const result = await connection.query(`SELECT * FROM Session 
            WHERE id_role = $1`, [id_role]);
        return result.rows;
    },

    async updateUser(id_user, id_role){
        const result = await connection.query(`UPDATE Session SET
                id_role = $2
            WHERE id_user = $1`, [id_user, id_role]);
        return result;
    },

    async updateRole(id_role, id_user){
        const result = await connection.query(`UPDATE Session SET
                id_user = $2
            WHERE id_role = $1`, [id_role, id_user]);
        return result;
    },

    async deleteUser(id_user){
        const result = await connection.query(`DELETE FROM Session 
            WHERE id_user = $1`, [id_user]);
        return result;
    },

    async deleteRole(id_role){
        const result = await connection.query(`DELETE FROM Session 
            WHERE id_role = $1`, [id_role]);
        return result;
    }
}