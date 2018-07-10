process.env.NODE_ENV = 'development';
var env= process.env.NODE_ENV || 'development';
if(env==='test'  || env==='development'){
var config = require('./config.json');
var envConfig = config[key];
Object.keys(envConfig).forEach((key)=>{
	process.env[key]= envConfig[key];
})
}