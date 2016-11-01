
var data = {
  test1: "foo",
  test2: 123,
  test3: "bar"
};

function getData(){
  return JSON.stringify(data);
}

function setData(d){
  data = JSON.parse(d);
  return d;
}
  
var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , port = 8080;

app.use(require("helmet")());
// app.use(function (req, res) {
//   res.send(getData());
// });
app.use(express.static('../tests/',{maxAge:1000}));
app.use(express.static('../bin/',{maxAge:1000}));
 
wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions 
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
 
  ws.on('message', function incoming(message,flags) {
    if (!flags.binary){
      setData(message);
    }
  });
 
  ws.send(getData());
});
 
server.on('request', app);
//app.listen(process.env.PORT, process.env.IP);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });