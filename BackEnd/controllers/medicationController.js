const medicationModel = require('../models/medication');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description){
            next(new Error());
        }

        medicationModel
            .insert(name, description)
            .then( (med) => {
                return res.status(200).json(med);
            })
            .catch(err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        medicationModel
            .get()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                next(err);
            });
    },

    deleteMed : (req, res, next) => {
        const id_med = req.params.id_med;
        if (!id_med) {
           next(new Error());
        }
        medicationModel
            .delete(id_med)
            .then( (data) => {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            })
    },

    update : (req, res, next) => {
        const id_med = req.params.id_med;
        const { name, description } = req.body;
        if (!name || !description){
           next(new Error());
        }
        medicationModel
            .update(id_med, name, description)
            .then( (data) => {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            })
    }
}