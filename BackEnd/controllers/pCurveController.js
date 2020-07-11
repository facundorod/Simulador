const pCurveModel = require('../models/pcurve');

module.exports = {
    insert : (req, res, next) => {
        const { id_as, id_pp, id_scenario, t, value } = req.body;
        pCurveModel
        .insert(id_as, id_pp, id_scenario, t, value)
        .then( () => {
            return res.status(200);
        })
        .catch(err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        pCurveModel
        .get() 
        .then( p => {
            return res.status(200).json(p);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_as, id_pp, id_scenario, t, value } = req.body;
        pCurveModel
        .update( id_as, id_pp, id_scenario, t, value)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const { id_as, id_pp, id_scenario } = req.body;
        pCurveModel
        .delete(id_as, id_pp, id_scenario)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    }
}