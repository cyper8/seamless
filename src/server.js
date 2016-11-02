
var data = {
  test1: "foo",
  test2: 123,
  test3: "bar"
};

function getData(){
  console.log("get data: "+JSON.stringify(data));
  return JSON.stringify(data);
}

function setData(d){
  console.log("set data: "+d);
  data = JSON.parse(d);
  return d;
}
  
var express = require('express')
  , url = require("url")
  , app = express()
  , expressWs = require("express-ws")(app);

app.use(require("helmet")());
// app.use(function (req, res) {
//   res.send(getData());
// });

app.ws('/test', function(ws, req){
  var location = url.parse(ws.upgradeReq.url, true);
  ws.on('message', function incoming(message,flags) {
    if (!flags.binary){
      setData(message);
      ws.send(getData());
    }
  });
  ws.send(getData());
});

app.use(express.static('../tests/',{maxAge:1000}));
app.use(express.static('../bin/',{maxAge:1000}));

app.listen(process.env.PORT, process.env.IP, function () { console.log('Listening on ' + process.env.PORT) });