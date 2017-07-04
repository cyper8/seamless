var express = require('express'),
  jsonParser = require("body-parser").json(),
  app = express(),
  expressWs = require("express-ws")(app),
  db = process.env.TEST_DB_URL || "mongodb://127.0.0.1/tests",
  mongoose = require("mongoose"),
  seamless = require("seamless-mongoose-plugin");

mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useMongoClient: true
}, function(err, connection) {
  if (err)
    throw err;
  connection.onOpen();
});

var testSchema = mongoose.Schema({
  "type": String,
  "count": Number,
  "hoverable": Boolean,
  "message": String,
  "addresee": String
});

testSchema.plugin(seamless);

var Test = mongoose.model("Test", testSchema);

app.use(require("helmet")());

app.use('/gtest/:_id', seamless.SeamlessHTTPEndpointFor(Test));

app.ws('/test/:_id', seamless.SeamlessWSEndpointFor(Test));

app.use(express.static(`${__dirname}`, {
  maxAge: 1000
}));
app.use(express.static(`${__dirname}/../../bin`, {
  maxAge: 1000
}));

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Listening on ' + process.env.PORT)
});
