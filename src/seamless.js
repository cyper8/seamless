/* global URL, Blob, Worker */
//var getWorkerCode = require("worker.js");
var storage = require("./storage.js")(),
    md5 = require("./md5.js")(),
    sync = require("./sync.js"),
    Seamless;

Seamless = {
  connection(url){
    return connections[md5(url)] || false;
  },
  connect(url){ // connection object closure
    var rh = md5(url), dh, ToServer, connection, buffer;

    function handle(data,to){
      var d,odh=storage.getItem(rh);
      if (typeof data !== "string"){
        try {
          d=JSON.stringify(data);
        }
        catch(err){
          throw err;
        }
      }
      else {
        try{
          d=data;
          data=JSON.parse(d);
        }
        catch(err){
          throw err;
        }
      }
      if (!buffer){
        buffer=data;
      }
      var dh=md5(d);
      if (odh !== dh){
        buffer=data;
        storage.removeItem(odh);
        storage.setItem(dh,d);
        storage.setItem(rh,dh);
        to(buffer);
      }
    }

    function Transmit(data){
      handle(data,ToServer);
    }

    function ToDOM(data){
      connection.clients.forEach(function(e,i,a){
        e.seamless.sync(data);
      });
    }

    function createConnection(Rx){ // takes data handling callback
                            //returns function which to be used as Transmitter

      if (Worker){
        worker = new Worker(
          URL.createObjectURL(
            new Blob(require("./worker.js").code(url))
          )
        );
        worker.onerror = function(e){
          worker.terminate();
          console.error(e);
        };
        worker.onmessage = function(e){
          if (e.data != "false") {
            handle(e.data,Rx);
          }
          else {
            alert("Connection lost. Reconnection constantly failing. Try reloading page.");
          }
        };
        return worker.postMessage;
      }
      else {
        (function(success){
          if (!(url.search(/^wss?:\/\//i)<0) && WebSocket){
            return require("./socket.js")(url,success);
          }
          else{
            return require("./poller.js")(url,success);
          }
        })(function(args){
          if (args && args != "false"){
            handle(args,Rx);
          }
          else {
            alert("Connection lost. Reconnection constantly failing. Try reloading page.");
          }
        });
      }
    }

    ToServer = createConnection(ToDOM);

    function AddClient(elem){
      elem.addEventListener("seamlessdatachange", function(e){
        e.stopPropagation();
        // get data together and send via Transmit
      })
      return elem;
    }

    connection = {
      url: url,
      hashes:{
        url: rh,
        get data(){
          return storage.getItem(connection.hashes.url);
        }
      },
      get data(){
        return buffer;
      },
      clients: [],
      bindClients(elems){
        if (buffer){
          elems.forEach(function(e,i,a){
            var elem = AddClient(e);
            if (elem){
              connection.clients.push(elem);
            }
          })
        }
        else {
          return Promise()
        }
      },
      unbindClients(elems){

      }
    };

    if (dh=storage.getItem(rh)){
      var b;
      if (b=storage.getItem(dh)){
        try{
          buffer=JSON.parse(b);
        }
        catch(err){
          throw err;
        }
      }
    }

    return connection;
  },
  disconnect(url){
    connection(url).unbindClients();
    delete connection(url);
  },
  connections: {},
}
