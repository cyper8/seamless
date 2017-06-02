

var express = require('express')
  , url = require("url")
  , bodyParser = require("body-parser")
  , jsonParser = bodyParser.json()
  , app = express()
  , expressWs = require("express-ws")(app)
  , dbconfig = require('./dbconf.json')
  , mongoose = require('mongoose')
  , seamlessMongoose = require("./seamless-mongoose-plugin.js");

mongoose.connect('mongodb://'+dbconfig.username+':'+dbconfig.password+'@'+dbconfig.url)
  .catch(function(err){throw err});
  
mongoose.plugin(seamlessMongoose);


const schema = {
  type: String,
  count: Number,
  hoverable: Boolean,
  message: String,
  addresee: String
};

const index = {addresee:1,type:1};

var buffer,clients,changed=true;

var Schema = mongoose.Schema;
var TestSchema = new Schema(schema);
TestSchema.index(index);

var TestModel = mongoose.model('TestModel',TestSchema);

app.use(require("helmet")());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test/:id', jsonParser, function (req, res) {
  TestModel.seamlesGetData(req.params.id,res);
});

app.post('/test/:id', jsonParser, function(req, res){
  if (!req.body) res.status(400).send('Not a valid JSON');
  else {
    req.body._id = req.params.id;
    TestModel.seamlessSetData(req.params.id,req.body,res);
  }
});

app.ws('/test/:id', function(ws, req){
  //var location = url.parse(ws.upgradeReq.url, true);
  seamlessMongoose.registerClient(req.params.id,ws);
  ws.on('message', function incoming(message,flags) {
    if (!flags.binary){
      TestModel.seamlessSetData(req.params.id,message,ws);
    }
  });
});

app.use(express.static('../tests/',{maxAge:1000}));
app.use(express.static('../bin/',{maxAge:1000}));

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Listening on ' + process.env.PORT)
});