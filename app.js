//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('Public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});
app.get('/register', function(req, res){
    res.render('register');
});
app.post('/register', function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        if (!err) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(function(err){
                if (err) {
                    console.log(err);
                } else {
                    res.render('secrets');
                }
            });
        } else {
            console.log(err);
        }
    });

    
});
app.post('/login', function(req, res){
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email: userName}, function(err, results){
        if (err) {
            console.log(err);
        } else {
            if (results) {
                bcrypt.compare(password, results.password, function(err, result){
                    if (!err) {
                        if (result === true){
                            res.render('secrets');
                        }
                }
            });
        }
    }
    });
});




let port = process.env.PORT;
if (port == null || port == '') {
    port = 3000;
}
app.listen(port, function(){
    console.log('Server started on ' + port);
});