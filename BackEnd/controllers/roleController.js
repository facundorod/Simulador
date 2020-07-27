const roleModel = require('../models/role');

module.exports = {
    insert : (req, res, next) => {
        const name = req.body.name;
        roleModel
        .insert(name)
        .then( (rc) => {
            return res.status(200).json(rc);
        })
        .catch( err => {
            next(err);
        })
    },

    get : (req, res, next) => {
        roleModel
        .get() 
        .then( roles => {
            return res.status(200).json(roles);
        })
        .catch( err => {
            next(err);
        })
    },

    update : (req, res, next) => {
        const { id_role, name } = req.body;
        roleModel
        .update(id_role, name)
        .then( (data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    },

    delete : (req, res, next) => {
        const id_role = req.body.id_role;
        roleModel
        .delete(id_role)
        .then( (data) => {
            return res.status(200).json(data);
        })
        .catch( err => {
            next(err);
        })
    }
}