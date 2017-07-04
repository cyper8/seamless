var Urlparse = require("url").parse;
var store = require("./testDataStore.js");

module.exports = function(options) {
  return function(req, res, next) {
    var url = Urlparse(req.url, true);
    var path = url.pathname.split("/").reverse();
    if (path[1] == 'gtest') {
      var id = path[0];
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      if (req.method == 'GET') {
        if (url.query.nopoll) {
          res.end(store.serialize(store.getData(id)));
        } else {
          setTimeout(function() {
            res.end('ok');
          }, 29000);
        }
      } else if (req.method == 'POST') {
        res.end(store.serialize(store.setData(id, req.body)));
      }
    }
    else next();
  }
}