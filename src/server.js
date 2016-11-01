
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
  , port = 4080;
 
app.use(function (req, res) {
  res.send(getData());
});
 
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
server.listen(port, function () { console.log('Listening on ' + server.address().port) });