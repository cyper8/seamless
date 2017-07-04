var express = require('express'),
  jsonParser = require("body-parser").json(),
  app = express(),
  expressWs = require("express-ws")(app),
  store = require("../../test/testDataStore.js");

app.use(require("helmet")());

app.use('/gtest/:_id', jsonParser, store.HTTPEndpointFor("_id"));
app.ws('/test/:_id', store.WSEndpointFor("_id"));

app.use(express.static(`${__dirname}`, {
  maxAge: 1000
}));
app.use(express.static(`${__dirname}/../../bin`, {
  maxAge: 1000
}));

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Listening on ' + process.env.PORT)
});
