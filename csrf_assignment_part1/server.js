const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const csrfCtrl = require('./controllers/csrfCtrl');
app.use('/',express.static(__dirname + '/view/Login'));
app.use('/app',express.static(__dirname + '/view/Form'));
app.use('/userSignIn', csrfCtrl);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/Login/login.html')
});
app.get('/app/Form', function (req, res) {
    res.sendFile(__dirname + '/view/Form/other_page.html')
});
app.listen(3000, function () {
    console.log('csrf thing running on port 3000!')
});

