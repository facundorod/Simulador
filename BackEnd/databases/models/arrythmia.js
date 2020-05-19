const connection = require('../db');

module.exports = {
    // Inserta una fila en la tabla
    async insert(name, description){
        let results = await connection.query(`INSERT INTO arrythmia
        (name, description) VALUES ($1,$2)`, [name, description]);
        return results;
    },
    // Obtiene todas las filas de la tabla
    async get(){
        const results = await connection.query(`SELECT id_arr, name, description 
                FROM arrythmia`);
        return results.rows;
    },


    async getById(id){
        const results = await connection.query(`SELECT id_arr, name, description 
                    FROM arrythmia
                    WHERE id_arr = $1`, [id]);
        //  Cuando hacemos una consulta que devuelve datos, los mismos vienen en la propiedad rows. 
        //  Si solo vamos a obtener un dato, accedemos a rows[0].
        return results.rows[0];
    
    },

    async update(id, name, description) {
        const results = await connection.query(`UPDATE arrythmia SET 
                    name=$1,
                    description=$2
                    WHERE id_arr = $3`, [name, description, id]);
        return results;
    },

    async delete(id){
        const results = await connection.query(`DELETE FROM arrythmia 
            WHERE id = $1`, [id]);
        return results;
    }

}