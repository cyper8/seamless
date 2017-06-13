var express = require('express'),
  url = require("url"),
  bodyParser = require("body-parser"),
  jsonParser = bodyParser.json(),
  app = express(),
  expressWs = require("express-ws")(app),
  dbconfig = require('./dbconf.json'),
  mongoose = require('mongoose'),
  seamlessMongoose = require("../bin/seamless-mongoose-plugin.js");

var mgoptions = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  user: dbconfig.username,
  pass: dbconfig.password
};

mongoose.connect('mongodb://' + dbconfig.username +
  ':' + dbconfig.password +
  '@' + dbconfig.url + ":" + dbconfig.port +
  '/' + dbconfig.db, mgoptions);

mongoose.plugin(seamlessMongoose);

const schema = {
  type: String,
  count: Number,
  hoverable: Boolean,
  message: String,
  addresee: String
};

const index = {
  addresee: 1,
  type: 1
};

var Schema = mongoose.Schema;
var TestSchema = new Schema(schema);
TestSchema.index(index);

var TestModel = mongoose.model('Test', TestSchema);

// ensure seeded db
TestModel.find({}).count(function(err, count) {
  if (err) {
    throw err;
  }
  if (!count) {
    var seed = require("./seed.json");
    seed.forEach(function(e, i, a) {
      TestModel.create(e);
    });
  }
  else console.log("model has " + count + " docs");
});

app.use(require("helmet")());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/gtest/:_id', TestModel.seamlessDataLink.bind(TestModel));
app.ws('/test/:_id', function(ws, req) {
  //var location = url.parse(ws.upgradeReq.url, true);
  seamlessMongoose.registerClient(req.originalUrl, ws);
  TestModel.seamlessDataLink(req, ws);
  ws.on('message', function incoming(message, flags) {
    if (!flags.binary) {
      try {
        var data = JSON.parse(message);
      }
      catch (err) {
        return ws.close(400, "Error parsing message");
      }
      console.log("saving data for " + req.params._id + "\n>>> " + message);
      TestModel.seamlessDataLink({
        method: "POST",
        originalUrl: req.originalUrl,
        params: req.params,
        body: data
      }, ws);
    }
  });
});

app.use(express.static(`${__dirname}`, {
  maxAge: 1000
}));
app.use(express.static(`${__dirname}/../bin`, {
  maxAge: 1000
}));

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Listening on ' + process.env.PORT)
});
