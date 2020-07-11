const scenarioPerSimulation = require('../models/scenarioPerSimulation');

module.exports = {
    insert : (req, res, next) => {
        const { id_scenario, id_simulation } = req.body;
        scenarioPerSimulation
        .insert(id_scenario, id_simulation)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        scenarioPerSimulation
        .get() 
        .then( sc => {
            return res.status(200).json(sc);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_scenario, id_simulation } = req.body;
        scenarioPerSimulation
        .updateScenario(id_scenario, id_simulation)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const { id_scenario, id_simulation } = req.body;
        scenarioPerSimulation
        .delete(id_scenario, id_simulation) 
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    }
}