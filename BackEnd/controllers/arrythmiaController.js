const arrythmiaModel = require('../models/arrhythmia');
const generalError = require('../errors/generalError');
const specificError = require('../errors/specificError');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if ( !name || !description) {
            next(new Error());
        }
        arrythmiaModel
            .insert(name, description)
            .then( (data) => {
                res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        arrythmiaModel
            .get()
            .then( arr => {
                res.status(200).json(arr);
            })
            .catch( err => {
                next(err);
            });
    },

    update : (req, res, next) => {
        const { id_arr, name, description } = req.body;
        if ( !name || !description) {
            next(new Error());
        }
        arrythmiaModel
            .update(id_arr, name, description)
            .then( () => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_arr = req.body.id_arr;
        if (!id_arr) {
            next(new Error());
        }
        arrythmiaModel
            .delete(id_arr)
            .then( () => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            });
    }
}