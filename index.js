const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;
// import passport from passport
// import * as http from "http";
var request = require('request');
// const session = require('express-session');
// const LocalStrategy = require('passport-local');
// const passport = require('passport');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

  app.use(express.static('public'));
  app.use(passport.initialize());
  app.use(passport.session());
// Answer API requests.
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://eila-pirates:user123@ds113845.mlab.com:13845/eila-pirates",
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", function() {
  console.log("mongoose connection error");
});

db.once("open", function() {
  console.log("mongoose connected successfully");
});
var collection = db.collection("Pirates");
var User = db.collection("users");

//Passport Authintication

passport.use(new BearerStrategy(
  function(token, done) {
    if (token === null){
      return done(err)
    }
    if (token) {
      return done(null, true)
    }
  }
));




function countSmileys(arr) {
  var count = 0
  for (var i = 0; i < arr.length; i++) {
      if (arr[i].length === 3) {
          if ((arr[i][0] === ";" || arr[i][0] === "8") && (arr[i][1] === "-" || arr[i][1] === "~") && (arr[i][2] === ")" || arr[i][2] === "|")) {
              count += 1
          }

      } else if (arr[i].length === 2) {
          if ((arr[i][0] === ";" || arr[i][0] === "8") && (arr[i][1] === ")" || arr[i][1] === "|")) {
              count += 1
          }
      }
  }
  return count

}

//Get data
app.get("/pirates", function(req, res) {
  collection
    .find({}, { projection: { _id: 0 } })
    .toArray(function(error, data) {
      res.send(data);
    });
});

app.get('/pirates/countPirates',
passport.authenticate('bearer', { session: false }),
  function(req, res) {
    request.get('https://eila-pirate-api.herokuapp.com/pirates/prison',
      
      function(error, response, body) {
        if (!error) {
          var arr = JSON.parse(body).faces
          var result =  countSmileys(arr);
          var obj = {
            piratesFound : result
        }
          res.send(obj)
        } else {
          res.json(error);
        }
      
    });
   
  });


 
app.listen(PORT, function() {
  console.error(
    `Node cluster worker ${process.pid}: listening on port ${PORT}`
  );
});
