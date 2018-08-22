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

otpservice.generate = generate;
otpservice.validate = validate;
//otpservice.sendmail = sendmail;
//otpservice.sendMailAPI = sendMailAPI;
module.exports = otpservice;

function generate(userObject) {
    var deferred = Q.defer();
    db.collection('registraion').findOne({ username: userObject.username, mobileno: userObject.mobileno }, function(err, user) {
        if (user) {
            // user exists
            deferred.reject({ "name": username, "message": "user already exists" });
        } else {
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            var mailOptions = {
                from: 'ankrgpta.bhpr@gmail.com', // sender address
                to: userObject.email, // list of receivers
                subject: 'Registration for Gupta ji', // Subject line
                html: '<p>your OTP is' + otp + '.Please enter the otp for SuccessFully Registration.' + '</p>' // plain text body
            };
            var dte = new Date();
            dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
            transporter.sendMail(mailOptions, function(err, info) {
                 console.log(err, info, 'err');
                if (err) {
                    // return false;
                } else {
                    info['otp'] = otp;
                    db.collection('otp').insert({
                        username: userObject.username,
                        mobileno: userObject.mobileno,
                        otp: response.otp,
                        timestamp: dte.toLocaleString(),
                        apiresponse: response.messageId
                    }, function(err, success) {
                        console.log(success, err);
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        deferred.resolve(info);

                    });
                    //return true;
                }
            });
            // otpresponse = makeAPICall(userObject);
            // console.log(otpresponse);
            var dte = new Date();
            // dte.setTime(dte.getTime() + (dte.getTimezoneOffset() + 330) * 60 * 1000);
            // otpresponse.then(function(response) {
                // console.log(response, 'response');
                // db.collection('otp').insert({
                //     username: userObject.username,
                //     mobileno: userObject.mobileno,
                //     otp: response.otp,
                //     timestamp: dte.toLocaleString(),
                //     apiresponse: response.messageId
                // }, function(err, success) {
                //     console.log(success, err);
                //     if (err) deferred.reject(err.name + ': ' + err.message);

                //     deferred.resolve(response);

                // });

            // }).catch(function(err) {
            //     deferred.reject({ "name": userObject.username, "message": err })
            // });
        }
    });
    return deferred.promise;
}

function validate(username, otp) {
    var deferred = Q.defer();
    db.otp.findOne({
        username: username,
        otp: otp
    }, function(err, success) {
        if (err) {
            db.otp.remove({ "username": username });
            deferred.reject(err.name + ': ' + err.message);
        }
        if (success) {
            db.collection('registraion').update({ 'username': username }, {
                $set: { "isValid": true }
            }, function(err, validUser) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (success) {

                }
            });

            // authentication successful
            db.otp.update({ "name": username }, {
                $set: { "status": "verified" }
            }, function(err, success) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (success) {
                    deferred.resolve({
                        username: username,
                        status: "verified"
                    });
                }
            });
        } else {
            // otp failed
            db.otp.remove({ "username": username });
            deferred.reject({
                name: username,
                message: "failed"
            });
        }
    });
    return deferred.promise;
}

// function makeAPICall(userObject) {
//     var deferred = Q.defer();
// var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false,alphabets :false });
//     var mailOptions = {
//   from: 'ankrgpta.bhpr@gmail.com', // sender address
//   to: userObject.email, // list of receivers
//   subject: 'Registration for Gupta ji', // Subject line
//   html: '<p>your OTP is'+ otp +'.Please enter the otp for SuccessFully Registration.'+'</p>'// plain text body
// };
//     transporter.sendMail(mailOptions, function (err, info) {
//    if(err) {
//      deferred.reject(err);
//      console.log(err,'err');
//    }
//    else{
//     info['otp'] = otp;
//     deferred.resolve(info);
//     console.log(info,'info');
// }
// });
//      return deferred.promise;
// }

function makeAPICall(userObject) {

    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var mailOptions = {
        from: 'ankrgpta.bhpr@gmail.com', // sender address
        to: userObject.email, // list of receivers
        subject: 'Registration for Gupta ji', // Subject line
        html: '<p>your OTP is' + otp + '.Please enter the otp for SuccessFully Registration.' + '</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        console.log(err, info, 'err');
        if (err) {

            console.log(err, 'err');
            return false;
        } else {
            info['otp'] = otp;
            console.log(info, 'info');
            return true;

        }
    });

}