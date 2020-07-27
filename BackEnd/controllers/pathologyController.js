const pathologyModel = require('../models/Patology');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description){
            next(new Error());
        }

        pathologyModel
            .insert(name, description)
            .then( (pat) => {
                return res.status(200).json(pat);
            })
            .catch(err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        pathologyModel
            .get()
            .then(data => {
                return res.status(200).send(data);
            })
            .catch(err => {
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_pat = req.params.id_pat;
        pathologyModel
            .delete(id_pat)
            .then( (data) => {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            })
    },

    update : (req, res, next) => {
        const id_pat = req.params.id_pat;
        const { name, description } = req.body;
        pathologyModel
            .update(id_pat, name, description)
            .then( (data) => {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            })
    }
}