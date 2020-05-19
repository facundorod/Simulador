const express = require('express');
const router = express.Router();

const arrythmiaModel = require('../databases/models/arrythmia');

router.get('/getArrythmias', function(req, res, next) {
    arrythmiaModel
        .get()
        .then( arrythmias => {
            console.log(arrythmias);
            res.send(arrythmias);
        })
        .catch( err => {
            console.log(err);
            return res.status(500).send("Error getting arrythmias");
        })

})