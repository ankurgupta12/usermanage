var express = require('express');
var router = express.Router();
var userRegistrationService = require('./../services/userReg.service');
var otpService = require('./../services/otpApi.service');
router.post('/', registartion);

router.post('/validate',validateOtp);
module.exports = router;

function registartion(req, res) {
    if (!req.body.username || !req.body.mobileno 
        || !req.body.password || !req.body.email) {
        res.status(200).send('{"error":Required param not found}');
        return false;
    }    
    userRegistrationService.registration(req.body).then(function(user,err) {
      if(user){
            res.status(200).send({user:user.ops,message:'otp Sent SuccessFully To your Email Please Check Your Email for registration!...'});
      }else {
        res.status(400).send("error in service");
      }
    })
}

function validateOtp(req,res) {
    console.log(req.body);
    if(!req.body.otp || !req.body.username){
        res.status(400).send('{"error":Required param not found}');
        return false;
    };
    otpService.validate(req.body).then(function(valid,error){
        if(valid){
             res.status(200).send(valid);
        }else {
         res.status(400).send("error in service");     
        }
    });
}
