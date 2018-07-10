var express = require('express');
var router = express.router();
var userRegistrationService = require('services/userReg.service');
router.post('/userReg', registartion);
module.exports = router;


function registartion(req, res) {
    if (!req.body.username || !req.body.mobileno || !req.body.password) {
        res.status(200).send('{"error":Required param not found}');
        return false;
    }
    userRegistrationService.registartion(req.body.password, req.body.username, req.body.mobileno).then((user) => {
        if (user) {
            res.send(user);
        } else {
            res.status(400).send({ "error": 'user is not saved In DB' });
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })
}