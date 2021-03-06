//jshint esversion:6
require('dotenv').config(); // dotenv
const express= require ("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");

const path= require('path');

const mongoose = require("mongoose");
const session = require("express-session");
const passport = require ("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const req = require('express/lib/request');

const app = express();

// app.use(express.static("./public"));
app.use(express.static("assets"));

app.set('view engine', 'ejs','html');

app.use(bodyParser.urlencoded({
    extended: true 
}));


app.use(session({
    secret: "Our little code",
    resave: false, 
    saveUninitialized: false,

}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect ("mongodb://localhost:27017/userTrip", {useNewUrlParser: true});
//

const userSchema =  new mongoose.Schema ({
    email: String ,
    password: String,
    name: String,
    // googleId: String,
    secret: String
}); 
// connect passportLocal Mongoose plugin 
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// new User model
const User = new mongoose.model("User", userSchema); 

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//------------------------------------------------>>> Server body function<<<--------------------------------------
app.get("/", function(req, res) {
    //demo
    // res.sendFile(path.join(__dirname+'/index.html'));
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})
//handle secret pages
app.get("/homepage", function (req, res) {


    if( req.isAuthenticated()) {
        res.render("homepage");
    }else {
        res.redirect("login");
    }
    // looking in our database for all secret property not equal to null
    //  User.find({"secret": {$ne: null}},function (err, foundUsers){
    //      if(err){
    //          console.log(err);
    
    //      }else { 
    //          if(foundUsers) {
    //              res.render("homepage", {usersWithSecrets: foundUsers});
    //          }
    //      }
    //  });
    });

//handle register pages
app.post ("/register", function (req, res) {
   
        User.register({username: req.body.username}, req.body.password , function(err, user){
            if(err) {
                console.log(err);
                    res.redirect("/register");
    
            }else {
                passport.authenticate("local") (req,res, function(){
                    res.redirect("/homepage");
                });
            }
        } );
     
    });

// after login --> authenticate--> move to /secrets page
app.post ("/login", function (req,res) {
    
        const user = new User( {
            username : req.body.username,
            password : req.body.password , 
    
        });
    // Log in method by passport plug in 
    // Read Document https://www.passportjs.org/concepts/authentication/login/
        req.login(user, function (err){
            if(err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, function () {
                    
                    res.redirect("/homepage");
                });
            }
        });
     
    }) ;

// handle logout 
app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
})
// --->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>handle each section
// handle each destination
app.
get("/newyork", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("newyork");
    }else {
        res.redirect("login");
    }
   
})

.get("/tokyo", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("tokyo");
    }else {
        res.redirect("login");
    }  
})
.get("/sydney", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("sydney");
    }else {
        res.redirect("login");
    }  
})
.get("/cairo", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("cairo");
    }else {
        res.redirect("login");
    }  
})
.get("/rome", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("rome");
    }else {
        res.redirect("login");
    }  
})
.get("/paris", function (req, res) {

    if( req.isAuthenticated()) {
        res.render("paris");
    }else {
        res.redirect("login");
    }  
})



app.listen(3000, function () {
    console.log("Server started on port 3000.");
}) ;