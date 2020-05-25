const medicationModel = require('../models/medication');

module.exports = {
    insert : (req, res) => {
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
                res.status(500).send("An error has occurred");
            });
    },

    get : (req, res) => {
        medicationModel
            .get()
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                res.status(500).send("An error has occurred");
            });
    },

    deleteMed : (req, res) => {
        const id = req.body;
        medicationModel
            .delete()
            .then(
                res.send("The medication has been deleted")
            )
            .catch( err => {
                res.status(500).send("An error has ocurred")
            })
    },

    update : (req, res) => {
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
                res.status(500).send("An error has occurred");
            })
    }
}