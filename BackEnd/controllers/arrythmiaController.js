const arrythmiaModel = require('../models/arrhythmia');
const generalError = require('../errors/generalError');
const specificError = require('../errors/specificError');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if ( !name || !description) {
            return res.status(500).send("The name and description can't be empty");
        }
        arrythmiaModel
            .insert(name, description)
            .then(
                res.send("The insert has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    get : (req, res, next) => {
        arrythmiaModel
            .get()
            .then( arr => {
                res.send(arr)
            })
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    update : (req, res, next) => {
        const { id_arr, name, description } = req.body;
        if ( !name || !description) {
            return res.status(500).send("The name and description can't be empty");
        }
        arrythmiaModel
            .update(id_arr, name, description)
            .then(
                res.send("The update has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_arr = req.body;
        if (!id_arr) {
            return res.status(500).send("The identifier can't be empty");
        }
        arrythmiaModel
            .delete(id_arr)
            .then(
                res.send("The delete has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    }
}