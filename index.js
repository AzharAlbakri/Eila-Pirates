const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;
var request = require("request");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
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
let collection = db.collection("Pirates");
let User = db.collection("users");

//Passport Authintication
passport.use(
  new BearerStrategy(function(token, done) {
    if (token === null) {
      return done(err);
    }
    if (token) {
      return done(null, true);
    }
  })
);

//Count smiley faces
function countSmileys(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length === 3) {
      if (
        (arr[i][0] === ";" || arr[i][0] === "8") &&
        (arr[i][1] === "-" || arr[i][1] === "~") &&
        (arr[i][2] === ")" || arr[i][2] === "|")
      ) {
        count += 1;
      }
    } else if (arr[i].length === 2) {
      if (
        (arr[i][0] === ";" || arr[i][0] === "8") &&
        (arr[i][1] === ")" || arr[i][1] === "|")
      ) {
        count += 1;
      }
    }
  }
  return count;
}

//Get data
//Pirates API
app.get("/pirates", function(req, res) {
  collection
    .find({}, { projection: { _id: 0 } })
    .toArray(function(error, data) {
      res.send(data);
    });
});

//pirates/countPirates authenticate API
app.get(
  "/pirates/countPirates",
  passport.authenticate("bearer", { session: false }),
  function(req, res) {
    request.get(
      "https://eila-pirate-api.herokuapp.com/pirates/prison",

      function(error, response, body) {
        if (!error) {
          let arr = JSON.parse(body).faces;
          let result = countSmileys(arr);
          let obj = {
            piratesFound: result
          };
          res.send(obj);
        } else {
          res.json(error);
        }
      }
    );
  }
);

app.listen(PORT, function() {
  console.error(
    `Node cluster worker ${process.pid}: listening on port ${PORT}`
  );
});
