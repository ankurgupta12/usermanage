var express = require('express');
var router = express.Router();
var userRegistrationService = require('services/userReg.service');
router.post('/', registartion);
module.exports = router;

function registartion(req, res) {
    if (!req.body.username || !req.body.mobileno 
        || !req.body.password || !req.body.email) {
        res.status(200).send('{"error":Required param not found}');
        return false;
    }
    console.log(req.body);
    userRegistrationService.registartion(req.body).then((user) => {
        if (user) {
            res.send({user,message:'registartion Successfully!...'});
        } else {
            res.status(400).send({ "error": 'user is not saved In DB' });
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })
}