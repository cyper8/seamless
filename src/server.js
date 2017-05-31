

var express = require('express')
  , url = require("url")
  , bodyParser = require("body-parser")
  , jsonParser = bodyParser.json()
  , app = express()
  , expressWs = require("express-ws")(app)
  , dbconfig = require('./dbconf.json')
  , mongoose = require('mongoose');

mongoose.connect('mongodb://'+dbconfig.username+':'+dbconfig.password+'@ds157631.mlab.com:57631/seamless-test')
  .catch(function(err){throw err});
  
var Schema = mongoose.Schema;
var TestSchema = new Schema({
  type: String,
  count: Number,
  hoverable: Boolean,
  message: String,
  addresee: String
});
TestSchema.index({addresee:1,type:1});

TestSchema.post('save',function(doc){
  
})


var TestModel = mongoose.model('TestModel',TestSchema);

function TestData(){
  var buffer,flag;
  function setData(data){
    
  }
  function getData(){
    
  }
  return {
    setData,
    getData
  }
}

var Test = TestData();

app.use(require("helmet")());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/test', jsonParser, function (req, res) {
  res.send(Test.getData());
});
app.post('/test', jsonParser, function(req, res){
  if (!req.body) res.sendStatus(400);
  else res.json(Test.setData(req.body));
});

app.ws('/test', function(ws, req){
  var location = url.parse(ws.upgradeReq.url, true);
  ws.on('message', function incoming(message,flags) {
    if (!flags.binary){
      ws.send(Test.setData(message));
    }
  });
  ws.send(Test.getData());
});

app.use(express.static('../tests/',{maxAge:1000}));
app.use(express.static('../bin/',{maxAge:1000}));

app.listen(process.env.PORT, process.env.IP, function () { console.log('Listening on ' + process.env.PORT) });