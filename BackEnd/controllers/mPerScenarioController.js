const mPerScenarioModel = require('../models/mPerScenario');

module.exports = {
    insert : (req, res, next) => {
        const { id_scenario, id_medication, dose, unit} = req.body;
        mPerScenarioModel
        .insert(id_scenario, id_medication, dose, unit)
        .then( (med) => {
            return res.status(200).json(med);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        mPerScenarioModel
        .get() 
        .then(med => {
            return res.status(200).json(med);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_scenario, id_medication, dose, unit } = req.body;
        mPerScenarioModel
        .update(id_scenario, id_medication, dose, unit)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const {id_scenario, id_medication} = req.body;
        mPerScenarioModel
        .delete(id_scenario, id_medication)
        .then( () => {
            return res.status(200);
        })
        .catch(err => {
            next(err);
        })
    }
}