var config = require('./../config/config.json');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoose');
var jwt =  require('jsonwebtoken');
var bcrypt = require('bcryptjs');

mongo.connect(config.development.MONGODB_URI);
var db = mongo.connection;
// mongo.connect(config.development.MONGODB_URI);
// var db = mongo.connection;
var service = {};
service.authenticate = authenticate;
module.exports = service;

 async function authenticate(username, password) {
    var deferred = Q.defer();
    const user =  await db.collection('registraion').findOne({username: username,hash:password});
    if(user && user.isValid) {
    const options = { expiresIn: '2d', issuer: 'https://localhost:4200/user'};
    const token = jwt.sign({sub: user._id}, config.secret, options);
    var userExist =  await db.collection('users').findOne({username: username});
    if(!userExist) {
    return  await db.collection('users').insert({username: username,token:token});
    }else {
        console.log('else');
        return userExist;
    }
 }   
}