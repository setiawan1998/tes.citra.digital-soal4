if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
const passport = require('passport');
const auth = require('./auth');

auth(passport);
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google'),
    (err, req, res, next) => {
        if (err.name === 'TokenError') {
            res.redirect('/auth/google');
        } else {
            console.log('error')
        }
    },
    (req, res) => {
        res.redirect('/html');
    }
);

app.use('/html', function (req, res, next) {
    const data = localStorage.getItem('dataUser');
    if(data == null){
        res.redirect('/auth/google')
    }else{
        next();
    }
})


app.get('/', (req, res) => {
    res.json({'status': 200})
})
app.get('/html', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/logout', (req, res) => {
    localStorage.removeItem('dataUser');
    res.redirect('/auth/google');
})
app.post('/encode', (req, res) => {
    var encode = require('./encode');
    var input = req.body.input;
    res.json({"status": 200,"output": encode.encode(input)})
})
app.post('/decode', (req, res) => {
    var decode = require('./decode');
    var input = req.body.input;
    res.json({"status": 200,"output": decode.decode(input)})
})

app.listen(3000, ()=>{
    console.log('Server running')
})
module.exports = app;