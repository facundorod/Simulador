const scenariosModel = require('../models/scenario');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description ){
            return res.status(500).send("The name and description can't be empty");
        }

        scenariosModel
            .insert(name, description)
                .then( res.send("The insert has been succesfull"))
                .catch( err => {
                    console.log(err);
                    next(err);
                });
    },

    get : (req, res, next) => {
        scenariosModel
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
        const {id_scenario, name, description} = req.body;
        scenariosModel
            .update(id_scenario, name, description)
                .then( res.send("The update has been succesfull"))
                .catch( err => {
                    console.log(err);
                    next(err);
                });
    },

    delete : (req, res, next) => {
        const id_scenario = req.body;
        if (!id_scenario) {
            return res.status(500).send("The identifier can't be empty");
        }
        scenariosModel
            .delete(id_scenario)
            .then(
                res.send("The delete has been succesfull")
            )
            .catch( err => {
                console.log(err);
                next(err);
            });
    }
}