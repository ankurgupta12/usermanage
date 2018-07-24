var config = require('./../config/config.json');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoose');
// var mongo = require('mongoskin');
console.log(config.development.MONGODB_URI);
mongo.connect(config.development.MONGODB_URI);
var db = mongo.connection;
//db.bind('registraion');
var bcrypt = require('bcryptjs');
var service = {};
service.registration = registration;
module.exports = service;

function registration(ReqParam){
var deferred = Q.defer();
console.log(ReqParam.username);
db.collection('registraion').findOne({username:ReqParam.username,mobileno:ReqParam.mobileno},function(err,user){
    if(err) deferred.reject(err.name+':'+err.message);
    if(user){
        console.log(user);
        deferred.reject('already exist');
    
    }else {
        createUser(ReqParam).then(function(err,userInsert){
            deferred.resolve(userInsert);
        });
    }
});
return deferred.promise;
}
function createUser(ReqParam) {
    var deferred = Q.defer();
    var user = _.omit(ReqParam,'password');
    user.hash = bcrypt.hashSync(ReqParam.password,10);
    db.collection('registraion').insert(user,function(err,doc){
        console.log(doc);
        if(err) deferred.reject();
        deferred.resolve(doc);
    });
    return deferred.promise;
}
