const sppModel = require('../models/spp');
const { restart } = require('nodemon');
const spp = require('../models/spp');

module.exports = {
    insert : (req, res, next) => {
        const { id_as, id_pp, id_scenario } = req.body;
        sppModel
        .insert(id_as, id_pp, id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        sppModel
        .get() 
        .then( spp => {
            return res.status(200).json(spp);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_as, id_pp, id_scenario } = req.body;
        sppModel
        .updateScenario(id_as, id_pp, id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        });
    },

    delete : (req, res, next) => {
        const { id_as, id_pp, id_scenario } = req.body;
        sppModel
        .delete(id_as ,id_pp, id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        });
    }
}