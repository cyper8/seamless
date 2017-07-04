function DataStore() {
  var store = require("./seed.json");

  function unarrayIfOne(docs) {
    if (docs instanceof Array && docs.length < 2) return docs[0];
    else return docs;
  }

  function serialize(data) {
    var sdata;
    try {
      sdata = (typeof data === "string") ? data : JSON.stringify(data);
    } catch (err) {
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
    } catch (err) {
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

  function HTTPEndpointFor(queryparams) {
    return function(req, res, next) {
      if (req.method == 'GET') {
        if (req.query.nopoll) {
          res.json(getData(req.params[queryparams]));
        } else {
          setTimeout(function() {
            res.status(200).type('json').end();
          }, 29000);
        }
      } else if (req.method == 'POST') {
        res.json(setData(req.params[queryparams], req.body));
      }
      else next();
    }
  }

  function WSEndpointFor(queryparams) {
    return function(ws, req) {
      ws.on('message', function incoming(message, flags) {
        if (!flags.binary) {
          ws.send(serialize(setData(req.params[queryparams], message)));
        }
      });
      ws.send(serialize(getData(req.params[queryparams])));
    }
  }
  return {
    serialize,
    deserialize,
    getData,
    setData,
    HTTPEndpointFor,
    WSEndpointFor
  }
}
module.exports = DataStore();
