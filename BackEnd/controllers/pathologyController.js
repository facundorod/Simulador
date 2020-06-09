const pathologyModel = require('../models/Patology');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description){
            return res.status(500).send("The name and description can't be empty");
        }

        pathologyModel
            .insert(name, description)
            .then(
                res.send("Insert operation has been succesfull")
            )
            .catch(err => {
                next(err);
            });
    },

    get : (req, res, next) => {
        pathologyModel
            .get()
            .then(data => {
                res.send(data)
            })
            .catch(err => {
                next(err);
            });
    },

    delete : (req, res, next) => {
        const id_pat = req.body;
        if (!id_pat) {
            return res.status(500).send("The identifier can't be empty");
        }
        pathologyModel
            .delete(id_oat)
            .then(
                res.send("The pathology has been deleted")
            )
            .catch( err => {
                console.log(err);
                next(err);
            })
    },

    update : (req, res, next) => {
        const { id_pat, name, description } = req.body;
        if (!name || !description){
            return res.status(500).send("The name and description can't be empty");
        }
        pathologyModel
            .update(id_pat, name, description)
            .then(
                res.send("The update has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            })
    }
}