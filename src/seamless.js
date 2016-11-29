/* global URL, Blob, Worker */
//var getWorkerCode = require("worker.js");
var storage = require("./storage.js")(),
    md5 = require("./md5.js")(),
    sync = require("./sync.js");

Window.Seamless={
  compile: function(dom){
    var seamlessElements = dom.querySelectorAll("*[data-seamless]");
    for (var i=0;i<seamlessElements.length;i++){
      var el=seamlessElements[i];
      this.connect(el.dataset.seamless).bindClients(el);
    }
  },
  connection: function(url){
    return this.connections[md5(url)] || false;
  },
  connect: function(url){ // connection object closure
    var rh = md5(url),
      dh,
      Transmit,
      connection,
      buffer,
      InitConnection;

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

    function ToDOM(data){
      connection.clients.forEach(function(e,i,a){
        if (e.seamless) e.seamless(data);
      });
    }

    if (!(connection=this.connection(url))){
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
      InitConnection=new Promise(function(success,error){
        var transmitter;
        
        if (Worker){
          var worker = new Worker(
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
              handle(e.data,success);
            }
            else {
              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            }
          };
          transmitter = function(msg){
            worker.postMessage(msg);
          };
        }
        else {
          transmitter = (function(callback){
            if (!(url.search(/^wss?:\/\//i)<0) && WebSocket){
              return require("./socket.js")(url,callback);
            }
            else{
              return require("./poller.js")(url,callback);
            }
          })(function(args){
            if (args && args != "false"){
              handle(args,success);
            }
            else {
              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            }
          });
        }

        Transmit=function (data){
          handle(data,transmitter);
        };
      })
      .then(ToDOM)
      .catch(function(err){
        throw err;
      });
      connection={
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
        bindClients: function(elems){
          if (!(elems instanceof Array)) elems=[elems];
          connection.clients.concat(elems);
          elems.forEach(function(e,i,a){
            var e = e;
            if (buffer){
              sync(buffer,e,Transmit);
            }
            else{
              e.connecting=InitConnection.then(function(){
                sync(buffer,e,Transmit);
                delete e.connecting;
              })
              .catch(function(err){throw err});
            }
          });
        },
        unbindClients: function(elems){
          if (!elems) elems=connection.clients;
          if (!(elems instanceof Array)) elems=[elems];
          elems.forEach(function(e,i,a){
            var index=connection.clients.indexOf(e);
            if (index >= 0) {
              var e = connection.clients.splice(index,1);
              if (e.deseamless) e.deseamless();
              else {
                e.connecting.then(function(element){
                  element.deseamless();
                })
                .catch(function(err){
                  throw err;
                });
              }
            }
          });
        }
      };
      this.connections[rh]=connection;
    }
    return connection;
  },
  disconnect: function(url){
    this.connection(url).unbindClients();
    delete this.connection(url);
  },
  connections: {},
};


window.addEventListener("load",function(){
  Window.Seamless.compile(document.body);
});