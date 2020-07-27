const sessionModel = require('../models/session');

module.exports = {
    insert : (req, res, next) => {
        const {id_user, id_role} = req.body;
        sessionModel
        .insert(id_user, id_role)
        .then( () => {
            return res.status(200);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        sessionModel
        .get()
        .then( data => {
            res.status(200).json(data);
        })
        .catch(err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const {id_user, id_role} = req.body;
        sessionModel
        .delete(id_user, id_role)
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch(err => {
            next(err);
        })
    }
}