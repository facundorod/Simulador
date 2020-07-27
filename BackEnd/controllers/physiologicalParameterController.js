const physiologicalP = require('../models/physiologicalParameter');

module.exports = {
    insert : (req, res, next) => {
        const { name, description, label, unit } = req.body;
        physiologicalP
        .insert(name, description, label, unit)
        .then( (ph) => {
            return res.status(200).json(ph);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        physiologicalP
        .get() 
        .then( p => {
            return res.status(200).json(p);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_pp, name, description, label, unit } = req.body;
        physiologicalP
        .update(id_pp, name, description, label, unit)
        .then( (data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const id_pp = req.body.id_pp;
        physiologicalP
        .delete(id_pp)
        .then( (data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    }
}