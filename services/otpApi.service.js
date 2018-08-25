var config = require('./../config/config.json');
/*const SendOtp = require('sendotp');*/

//const sendOtp = new SendOtp('AuthKey', 'Otp for your order is {{otp}}, please do not share it with anybody');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoose');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ankrgpta.bhpr@gmail.com',
        pass: 'ankur10199302'
    }
});
var otpGenerator = require('otp-generator')
// var mongo = require('mongoskin')
mongo.connect(config.development.MONGODB_URI);
var db = mongo.connection;

//db.bind('registraion');
var bcrypt = require('bcryptjs');
var otpservice = {};
otpservice.validate = validate;
module.exports = otpservice;

function validate(body) {
    var deferred = Q.defer();
    db.collection('otp').findOne({
        username: body.username,
        otp: body.otp
    }, function(err, success) {
        console.log(err,success);
        if (err) {
            db.collection('otp').remove({ "username": body.username });
            deferred.reject(err.name + ': ' + err.message);
        }
        if (success) {
            var dte = new Date();
            dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
            var difference = parseInt(dte.getTime()- new Date(success.timestamp).getTime(),10); 
            var minutesDifference = Math.floor(difference / 1000 / 60);
            if(minutesDifference <= config.validTimeInterval){
            db.collection('registraion').update({ 'username': body.username }, {
                $set: { "isValid": true }
            }, function(err, validUser) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve({message:'' +body.username +"successfully Registered..."})
            });
        } else {
            db.collection('otp').remove({ "username": body.username });
         deferred.resolve({message: "otp is expired"});      
        }

    }   
    });
    return deferred.promise;
}