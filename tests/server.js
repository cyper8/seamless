var express = require('express'),
  url = require("url"),
  bodyParser = require("body-parser"),
  jsonParser = bodyParser.json(),
  app = express(),
  expressWs = require("express-ws")(app),
  store = DataStore();

function DataStore() {
  var store = require("./seed.json");

  function unarrayIfOne(docs) {
    if (docs instanceof Array && docs.length == 1) return docs[0];
    else return docs;
  }

  function serialize(data) {
    var sdata;
    try {
      sdata = (typeof data === "string") ? data : JSON.stringify(data);
    }
    catch (err) {
      sdata = "";
      console.error(err);
    }
    finally {
      return sdata;
    }
  }

  function deserialize(sdata) {
    var data;
    try {
      data = (typeof sdata === "object") ? sdata : JSON.parse(sdata);
    }
    catch (err) {
      data = {};
      console.error(err);
    }
    finally {
      return data;
    }
  }

  function getData(id) {
    return unarrayIfOne(
      store.filter(function(e) {
        return e._id == id;
      })
    );
  }

  function setData(id, data) {
    var d = deserialize(data);
    d._id = id;
    for (var i = 0; i < store.length; i++) {
      if (store[i]._id == id) {
        store[i] = d;
        break;
      }
    }
    return d;
  }

  return {
    serialize,
    deserialize,
    getData,
    setData
  };
}

app.use(require("helmet")());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/gtest/:_id', function(req, res, next) {
  if (req.method == 'GET') {
    res.send(store.serialize(store.getData(req.params._id)));
  }
  else if (req.method == 'POST') {
    res.send(store.serialize(store.setData(req.params._id, req.body)));
  }
});

app.ws('/test/:_id', function(ws, req) {
  //var location = url.parse(ws.upgradeReq.url, true);
  ws.on('message', function incoming(message, flags) {
    if (!flags.binary) {
      ws.send(store.serialize(store.setData(req.params._id, message)));
    }
  });
  ws.send(store.serialize(store.getData(req.params._id)));
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
