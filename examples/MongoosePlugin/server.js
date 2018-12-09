const IP = process.env.IP||'0.0.0.0';
const PORT = process.env.PORT||3000;
var express = require('express'),
  jsonParser = require("body-parser").json(),
  app = express(),
  expressWs = require("express-ws")(app),
  db = process.env.TEST_DB_URL || "mongodb://127.0.0.1/tests",
  mongoose = require("mongoose"),
  seamless = require("seamless-mongoose-plugin"),
  dbseed = require("../../test/seed.json");

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

Test.deleteMany({}).exec().then(function() {
  return Test.create(dbseed);
})
  .then(function() {
    console.log("DB seeded");
  });

app.use(require("helmet")());

app.use('/gtest/:_id', jsonParser, seamless.SeamlessHTTPEndpointFor(Test));

app.ws('/test/:_id', seamless.SeamlessWSEndpointFor(Test));

app.use(express.static(`${__dirname}`, {
  maxAge: 1000
}));
app.use(express.static(`${__dirname}/../../bin`, {
  maxAge: 1000
}));

app.listen(PORT, IP, function() {
  console.log('Listening on ' + PORT);
});
