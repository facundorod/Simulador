const simulationModel = require('../models/simulation');

module.exports = {
    insert : (req, res, next) => {
        const { name, description, id_as } = req.body;
        simulationModel
        .insert(name, description, id_as)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        simulationModel
        .get()
        .then( data => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_simulation, name, description, id_as } = req.body;
        simulationModel
        .update(id_simulation, name, description, id_as)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch(err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const id_simulation = req.body.id_simulation;
        simulationModel
        .delete(id_simulation)
        .then( (data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    }
}