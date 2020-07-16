const ppPerAsModel = require('../models/ppPerAs');

module.exports = {
    insert : (req, res, next) => {
        const { id_as, id_pp, alarm_low, alarm_high } = req.body;
        ppPerAsModel
        .insert(id_as, id_pp, alarm_low, alarm_high)
        .then( (pp) => {
            return res.status(200).json(pp);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        ppPerAsModel
        .get()
        .then( pp => {
            return res.status(200).json(pp);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_as, id_pp, alarm_low, alarm_high } = req.body;
        ppPerAsModel
        .update(id_as, id_pp, alarm_low, alarm_high)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const { id_as, id_pp } = req.body;
        ppPerAsModel
        .delete (id_as, id_pp)
        .then(() => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    }
}