const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

//Get data
app.get("/pirates", function(req, res) {
  collection
    .find({}, { projection: { _id: 0 } })
    .toArray(function(error, data) {
      res.send(data);
    });
});

app.listen(PORT, function() {
  console.error(
    `Node cluster worker ${process.pid}: listening on port ${PORT}`
  );
});
