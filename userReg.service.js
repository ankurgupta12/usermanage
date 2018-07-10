var config = require('config.json');
var Q = require('q');
var _ = require('lodash');
var mongo = require('mongoskin');
var db = mongo.db(config.db,{native_parser:true});
db.bind('registraion');
console.log(db);
var service = {};
service.registration = registration;
module.exports = service;

function registration(username,password,mobileno){
var deferred = Q.defer();
db.users.findOne({username:userName},function(err,user){
    if(err) deferred.reject(err.name+':'+err.message);
    if(user){
        deferred.reject('already exist');
    
    }else {
        createUser();
    }
});
}
function createUser() {
    var user = _.omit(userParam,'password');
    user.hash = bcrypt.hashSync(userParam.password,10);
    db.users.insert(user,function(err,doc){
        if(err) deferred.reject();
        deferred.resolve();
    });
    return deferred.promise();
}