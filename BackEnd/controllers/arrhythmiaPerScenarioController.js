const arrhythmiaPerScenarioModel = require('../models/arrhythmiaPerScenario');

module.exports = {

    insert : (req,res, next) => {
        const { id_scenario, id_arr } = req.body;
        if (! id_scenario || ! id_arr) {
            next(new Error());
        }

        arrhythmiaPerScenarioModel
        .insert(id_scenario, id_arr)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        arrhythmiaPerScenarioModel
        .get()
        .then( data => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })

    },

    deleteScenario : (req, res, next) => {
        const id_scenario = req.body.id_scenario;
        if (!id_scenario) {
            next(new Error());
        }
        arrhythmiaPerScenarioModel
        .deleteScenario(id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    deleteArrhythmia : (req, res, next) => {
        const id_arr = req.body.id_arr;
        if (! id_arr) {
            next(new Error());
        }
        arrhythmiaPerScenarioModel
        .deleteArr(id_arr)
        .then( () => {
            return res.status(200);
        })
        .catch(err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const { id_arr, id_scenario } = req.body;
        if (!id_arr || !id_scenario){
            next(new Error());
        }

        arrhythmiaPerScenarioModel
        .delete(id_arr, id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    }
}