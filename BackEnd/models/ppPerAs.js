const connection = require('../databases/db');

module.exports = {
    async insert(id_as, id_pp, alarm_low, alarm_high){
        const result = await connection.query(`INSERT INTO PPperAs
            (id_as, id_pp, alarm_low, alarm_high)
            VALUES ($1, $2, $3, $4)`, [id_as, id_pp, alarm_low, alarm_high]);
        return result;
    },

    async get(){
        const results = await connection.query(`SELECT * FROM PPperAs`);
        return results.rows;
    },

    async getById(id_as, id_pp){
        const result = await connection.query(`SELECT * FROM PPperAs
            WHERE id_as = $1 AND id_pp = $2`, [id_as, id_pp]);
        return result.rows[0];
    },

    async update(id_as, id_pp, alarm_low, alarm_high){
        const result = await connection.query(`UPDATE PPperAs SET
            alarm_low = $3,
            alarm_high = $4
            WHERE id_as = $1 AND id_pp = $2`, [id_as, id_pp, alarm_low, alarm_high]);
        return result;
    },

    async delete(id_as, id_pp){
        const result = await connection.query(`DELETE FROM PPperAs 
            WHERE id_as = $1 AND id_pp = $2`, [id_as, id_pp]);
        return result;
    }
}