const connection = require('../databases/db');

module.exports = {

    async insert(e_mail, name, surname, password, institution) {
        const results = await connection.query(`INSERT INTO User
            (e_mail, name, surname, password)
            VALUES ($1, $2, $3, $4, $5)`, [e_mail, name, surname, password, institution]);
        return results;
    },

    async get() {
        const results = await connection.query(`SELECT * FROM User`);
        return results.rows;
    },

    async getById(id_user){
        const result = await connection.query(`SELECT * FROM User
            WHERE id_user = $1`, [id_user]);
        return result.rows[0];
    },

    async update(id_user, e_mail, name, surname, password, institution){
        const results = await connection.query(`UPDATE User SET
                e_mail = $2,
                name = $3, 
                surname = $4,
                password = $5,
                institution = $6
            WHERE id_use = $1`, [id_user, e_mail, name, surname, password, institution]);
        return results;
    },

    async delete(id_user){
        const result = await connection.query(`DELETE FROM User
            WHERE id_user = $1`, [id_user]);
        return result;
    }

}