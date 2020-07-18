const animalSpeciesModel = require('../models/animalSpecies');

module.exports = {
    insert : (req, res, next) => {
        const { name } = req.body;
        if ( !name ) {
            next(new Error());
        }
        animalSpeciesModel
            .insert(name)
            .then( (data) => {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        animalSpeciesModel
            .get()
            .then( arr => {
                res.status(200).json(arr);
            })
            .catch( err => {
                next(err);
            });
    },

    update : (req, res, next) => {
        const name = req.body.name;
        const id_as = req.params.id_as;
        if ( !name ) {
            next(new Error());
        }
        animalSpeciesModel
            .update(id_as, name)
            .then( () => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_as = req.params.id_as;
        if (!id_as) {
            next(new Error());
        }
        animalSpeciesModel
            .delete(id_as)
            .then(() => {
                return res.status(200);
            })
            .catch( err => {
                next(err);
            });
    }
}
