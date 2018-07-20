var config = require('./../config/config.json');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoskin');
var db = mongo.db(config.development.MONGO_DB_URI,{native_parser:true});
db.bind('registraion');
var service = {};
service.registration = registration;
module.exports = service;

function registration(ReqParam){
var deferred = Q.defer();
db.registraion.findOne({username:ReqParam.userName,mobileno:ReqParam.mobileno},function(err,user){
    if(err) deferred.reject(err.name+':'+err.message);
    if(user){
        deferred.reject('already exist');
    
    }else {
        createUser(ReqParam);
    }
});
}
function createUser(ReqParam) {
    var user = _.omit(ReqParam,'password');
    user.hash = bcrypt.hashSync(ReqParam.password,10);
    db.registraion.insert(user,function(err,doc){
        if(err) deferred.reject();
        deferred.resolve();
    });
    return deferred.promise();
}
