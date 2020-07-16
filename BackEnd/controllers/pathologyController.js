const pathologyModel = require('../models/Patology');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description){
            next(new Error());
        }

        pathologyModel
            .insert(name, description)
            .then( (data) => {
                return res.status(200).json(data);
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
        const id_pat = req.body.id_pat;
        if (!id_pat) {
            next(new Error());
        }
        pathologyModel
            .delete(id_pat)
            .then( () => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            })
    },

    update : (req, res, next) => {
        const { id_pat, name, description } = req.body;
        if (!name || !description){
            next(new Error());
        }
        pathologyModel
            .update(id_pat, name, description)
            .then( () => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            })
    }
}