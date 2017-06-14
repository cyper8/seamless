/* global URL, Blob, Worker, HTMLElement */
//var getWorkerCode = require("worker.js");
var storage = require("./storage.js")(),
  md5 = require("./md5.js")(),
  sync = require("./ssync.js");

function getBufferByURLHash(urlhash) {
  var dh, d;
  if (dh = storage.getItem(urlhash)) {
    try {
      d = JSON.parse(storage.getItem(dh));
    }
    catch (err) {
      throw err;
    }
  }
  else d = undefined;
  return d;
}

//function getBufferByURL(url){
//  return getBufferByURLHash(md5(url));
//}

module.exports = window.Seamless = {

  compile: function(dom) {
    var seamlessElements = dom.querySelectorAll("*[data-seamless]");
    for (var i = 0; i < seamlessElements.length; i++) {
      var el = seamlessElements[i];
      this.connect(el.dataset.seamless).bindClients(el);
    }
  },

  connection: function(url) {
    return this.connections[md5(url)] || false;
  },

  connect: function(url) { // connection object closure

    var rh = md5(url),
      connection,
      buffer,
      InitConnection;

    if (connection = this.connection(url)) return connection;

    // new connection

    buffer = getBufferByURLHash(rh);

    InitConnection = new Promise(function(success, error) {
        var transmitter, Transmit, Receive;

        function bufferedHandle(data, to) {
          var d, odh = storage.getItem(rh);
          if (typeof data !== "string") {
            try {
              d = JSON.stringify(data);
            }
            catch (err) {
              throw err;
            }
          }
          else {
            try {
              d = data;
              data = JSON.parse(d);
            }
            catch (err) {
              throw err;
            }
          }
          to(buffer = data);
          var dh = md5(d);
          if (odh !== dh) {
            storage.removeItem(odh);
            storage.setItem(dh, d);
            storage.setItem(rh, dh);
          }
        }

        Receive = function(res) {
          var data = (res.data) ? res.data : res;
          if (data && data != "false") {
            bufferedHandle(data, ToDOM);
            success(Transmit);
          }
          else {
            error(new Error("Connection lost."));
          }
        };

        function ToDOM(data) {
          connection.clients.forEach(function(e, i, a) {
            if (e.seamless) e.seamless(data);
            else e.status = data;
          });
        }

        if (Worker) {
          transmitter = (function(receiver) {
            var worker = new Worker(
              URL.createObjectURL(
                new Blob(require("./worker.js").code(url))
              )
            );
            worker.onerror = function(e) {
              //worker.terminate();
              error(e);
            };
            worker.onmessage = receiver;
            return function(data) {
              worker.postMessage(data)
            };
          })(Receive);
        }
        else {
          transmitter = (function(callback) {
            if (!(url.search(/^wss?:\/\//i) < 0) && WebSocket) {
              return require("./socket.js")(url, callback);
            }
            else {
              return require("./poller.js")(url, callback);
            }
          })(Receive);
        }

        Transmit = function(data) {
          bufferedHandle(data, transmitter);
        };
      })
      .catch(function(err) {
        console.error(err);
      });

    return this.connections[rh] = connection = {
      url: url,
      hashes: {
        url: rh,
        get dataHash() {
          return storage.getItem(connection.hashes.url);
        }
      },
      get data() {
        return buffer;
      },
      clients: [],
      bindClients: function(elems) {
        if (!(elems instanceof Array)) elems = [elems];
        elems.forEach(function(e, i, a) {
          e.connecting = InitConnection.then(function(transmit) {

              function SeamlessDataChangeEventHandler(evt) {
                transmit(buffer);
                evt.stopPropagation();
              }

              if (e instanceof HTMLElement) {
                e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                  e.seamless = window[e.dataset.sync].bind(e);
                }
                else {
                  e.seamless = sync.bind(e);
                }
                e.deseamless = function() {
                  this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                  delete this.seamless;
                }.bind(e);
                e.seamless(buffer, transmit);
              }
              else {
                if (typeof e === "object") {
                  //TODO: seamless client-side reciever is a JS object
                  e.__defineGetter__("status", function() {
                    return buffer
                  });
                  e.__defineSetter__("status", transmit);
                }
                else if (typeof e === "function") {
                  a[i] = {
                    seamless: e,
                    deseamless: function() {
                      delete this.seamless;
                    }
                  }
                }
                e.status = buffer;
              }
              delete e.connecting;
            })
            .catch(function(err) {
              throw err
            });
          connection.clients.push(e);
        });
      },
      unbindClients: function(elems) {
        if (!elems) elems = connection.clients;
        if (!(elems instanceof Array)) elems = [elems];
        elems.forEach(function(e, i, a) {
          var index = connection.clients.indexOf(e);
          if (index >= 0) {
            var e = connection.clients.splice(index, 1);
            if (e.deseamless) e.deseamless();
            else {
              e.connecting.then(function() {
                  e.deseamless();
                })
                .catch(function(err) {
                  throw err;
                });
            }
          }
        });
      }
    };
  },

  disconnect: function(url) {
    this.connection(url).unbindClients();
    delete this.connection(url);
  },

  connections: {},
};
