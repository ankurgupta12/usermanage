require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var md5 = require('md5');
var bodyParser = require('body-parser');
var config = require('config.json');

var expressJWT = require('express-jwt');
process.env.NODE_ENV = 'development';
var env = process.env.NODE_ENV;
if (env === 'test' || env === 'development') {
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    })
}
var port = process.env.port || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// jwt token
var regPost = require('./controller/userRegistration');
app.use('/', regPost);

app.listen(port, () => {
    console.log('started on port' + port);
});



