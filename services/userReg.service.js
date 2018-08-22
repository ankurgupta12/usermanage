var config = require('./../config/config.json');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoose');
var otpService = require('./otpApi.service');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ankrgpta.bhpr@gmail.com',
        pass: 'ankur10199302'
    }
});
var otpGenerator = require('otp-generator')
// var mongo = require('mongoskin');
console.log(config.development.MONGODB_URI);
mongo.connect(config.development.MONGODB_URI);
var db = mongo.connection;
//db.bind('registraion');
var bcrypt = require('bcryptjs');
var service = {};
service.registration = registration;
module.exports = service;

function registration(ReqParam) {
    var deferred = Q.defer();
    db.collection('registraion').findOne({ username: ReqParam.username, mobileno: ReqParam.mobileno }, function(err, user) {
        if (err) deferred.reject(err.name + ':' + err.message);
        if (user) {
            deferred.reject('already exist');
        } else {
            var user = _.omit(ReqParam, 'password');
            user.hash = bcrypt.hashSync(ReqParam.password, 10);
            db.collection('registraion').findOne({ username: ReqParam.username, mobileno: ReqParam.mobileno }, function(err, user) {
                if (user) {
                    // user exists
                    deferred.reject({ "name": ReqParam.username, "message": "user already exists" });
                } else {
                    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    var mailOptions = {
                        from: 'ankrgpta.bhpr@gmail.com', // sender address
                        to: ReqParam.email, // list of receivers
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
                                username: ReqParam.username,
                                mobileno: ReqParam.mobileno,
                                otp: otp,
                                timestamp: dte.toLocaleString(),
                                apiresponse: info.messageId
                            }, function(err, success) {
                                
                                if (err) deferred.reject(err.name + ': ' + err.message);
                                if (success) {
                                    console.log(success,'AnkurSucesss');
                                    return deferred.resolve(success);
                                }
                            });
                            //return true;
                        }

                    });
                }
            });
            user['isValid'] = false;
            db.collection('registraion').insert(user, function(err, doc) {
                if (err) {
                    deferred.reject()
                }
            });
        }
    });
    return deferred.promise;
}

function createUser(ReqParam) {
    var deferred = Q.defer();
    var user = _.omit(ReqParam, 'password');
    user.hash = bcrypt.hashSync(ReqParam.password, 10);
    db.collection('registraion').findOne({ username: ReqParam.username, mobileno: ReqParam.mobileno }, function(err, user) {
        if (user) {
            // user exists
            deferred.reject({ "name": ReqParam.username, "message": "user already exists" });
        } else {
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            var mailOptions = {
                from: 'ankrgpta.bhpr@gmail.com', // sender address
                to: ReqParam.email, // list of receivers
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
                        username: ReqParam.username,
                        mobileno: ReqParam.mobileno,
                        otp: otp,
                        timestamp: dte.toLocaleString(),
                        apiresponse: info.messageId
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
    // otpService.generate(ReqParam).then(function(err,otpObject){
    //     if(err) {
    //         deferred.reject('otp not generted');
    //     } 
    // deferred.resolve({message:"otpSent Succesfully"});

    // });
    user['isValid'] = false;
    db.collection('registraion').insert(user, function(err, doc) {
        if (err) {
            deferred.reject()
        } else {
            deferred.resolve(doc);
        };
    });
    return deferred.promise;
};