const animalSpeciesModel = require('../models/animalSpecies');

module.exports = {
    insert : (req, res, next) => {
        const { name } = req.body;
        if ( !name ) {
            return res.status(500).send("The name can't be empty");
        }
        animalSpeciesModel
            .insert(name)
            .then(
                res.send("The insert has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    get : (req, res, next) => {
        animalSpeciesModel
            .get()
            .then( arr => {
                res.send(arr)
            })
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    update : (req, res, next) => {
        const { id_as, name  } = req.body;
        if ( !name ) {
            return res.status(500).send("The name can't be empty");
        }
        animalSpeciesModel
            .update(id_as, name)
            .then(
                res.send("The update has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_as = req.body;
        if (!id_as) {
            return res.status(500).send("The identifier can't be empty");
        }
        animalSpeciesModel
            .delete(id_as)
            .then(
                res.send("The delete has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    }
}
