var express = require('express');
var router = express.Router();
var loginService  =  require('./../services/loginService');

// routes
router.post('/authenticate', authenticate);

module.exports = router;

function authenticate(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(200).send('{"error" : "Required params not found" }');
        return false;
    }
    loginService.authenticate(req.body.username, req.body.password)
        .then((user)=> {
            console.log(user);
            if (user.ops) {
                // authentication successful
                res.status(200).send({username:user.ops[0].username,token:user.ops[0].token.split('.')[2],message:"login successfullly.."});
            } else if(!user.ops){
                // authentication failed

            res.status(200).send({username:user.username,token:user.token.split('.')[2],message:"login successfullly.."});
            }else {
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch((err)=> {
            res.status(400).send(err);
        });
}