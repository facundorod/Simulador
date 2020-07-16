const scenariosModel = require('../models/scenario');

module.exports = {
    insert : (req, res, next) => {
        const { name, description } = req.body;
        if (!name || !description ){
            next(new Error());
        }

        scenariosModel
            .insert(name, description)
                .then( (scenario) => {
                    return res.status(200).json(scenario);   
                })
                .catch( err => {
                    next(err);
                });
    },

    get : (req, res, next) => {
        scenariosModel
        .get()
        .then( scenarios => {
            return res.status(200).json(scenarios);
        })
        .catch( err => {
            next(err);
        });
    },

    update : (req, res, next) => {
        const {id_scenario, name, description} = req.body;
        scenariosModel
            .update(id_scenario, name, description)
                .then( () => {
                    return res.status(200);
                })
                .catch( err => {
                    next(err);
                });
    },

    delete : (req, res, next) => {
        const id_scenario = req.body.id_scenario;
        if (!id_scenario) {
            next(new Error());
        }
        scenariosModel
            .delete(id_scenario)
            .then((data)=> {
                return res.status(200).json(data);
            })
            .catch( err => {
                next(err);
            });
    }
}