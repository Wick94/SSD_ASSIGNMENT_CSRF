const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const app = express();
let salt = null;
let sesion_id = null;
let theToken = null;
router.post('/authenticating',(req,res) => {
    console.log("inside Ctrl");
    console.log('login body== ', req.body);
    if(req.body.username == "Vikz" && req.body.password == "123456"){
        sesion_id = genSid();
        salt = salting(14);
        theToken = genToken(sesion_id,salt);
        console.log("session id==",sesion_id);
        console.log("salt",salt);
        console.log("token",theToken);
        res.cookie('sesion_id', sesion_id, { maxAge: 900000, httpOnly: false });
        console.log("Successfully logged in");
        res.redirect('/app/Form');
    }
    else {
        res.json({ success: false, message: 'Login failed check your password and username!!' });
    }
});
//passing the token
router.post("/getTheToken",(req,res) =>{
    var sesId = req.body.sesion_id;
    if (sesId === sesion_id)
    {
        res.json({ failed: false, CSRF: theToken });
    } else {
        res.json({ failed: true });
    }
});
//validating csrf token
router.post("/tokenValidation",(req,res)=> {
    var sid = req.cookies.sesion_id;
    var token = req.body.CSRFtoken;
    if (sid == sesion_id &&  token == theToken){
        res.redirect('/app/Form?failed=false');
    }
    else{
        res.redirect('/app/Form?failed=true');
    }
});
//generate a salt
function salting(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}
//generate a token
function genToken(sesion_id,salt) {
    var hashing = crypto.createHmac('sha512', salt);
    hashing.update(sesion_id);
    return hashing.digest('hex');
}
//generate a session id
function genSid() {
    var ab = crypto.createHash('sha256');
    ab.update(Math.random().toString());
    return ab.digest('hex');
}

module.exports = router;