
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

  return {
    serialize,
    deserialize,
    getData,
    setData
  };
}

module.exports = function(options) {
  var store = DataStore();
  return function(req, res, next) {
    var url = req.url.split("/").reverse();
    if (url[1] == 'gtest') {
      var id = url[0];
      if (req.method == 'GET') {
        res.end(store.serialize(store.getData(id)));
      } else if (req.method == 'POST') {
        res.end(store.serialize(store.setData(id, req.body)));
      }
    }
    else next();
  }
}