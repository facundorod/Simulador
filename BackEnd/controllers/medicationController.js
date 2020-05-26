const medicationModel = require('../models/medication');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description){
            return res.status(500).send("The name and description can't be empty");
        }

        medicationModel
            .insert(name, description)
            .then(
                res.send("Insert operation has been succesfull")
            )
            .catch(err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        medicationModel
            .get()
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                next(err);
            });
    },

    deleteMed : (req, res, next) => {
        const id_med = req.body;
        if (!id_med) {
            return res.status(500).send("The identifier can't be empty");
        }
        medicationModel
            .delete(id_med)
            .then(
                res.send("The medication has been deleted")
            )
            .catch( err => {
                console.log(err);
                next(err);
            })
    },

    update : (req, res, next) => {
        const { id_med, name, description } = req.body;
        if (!name || !description){
            return res.status(500).send("The name and description can't be empty");
        }
        medicationModel
            .update(id_med, name, description)
            .then(
                res.send("The update has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            })
    }
}