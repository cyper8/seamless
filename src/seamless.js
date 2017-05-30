/* global URL, Blob, Worker, HTMLElement */
//var getWorkerCode = require("worker.js");
var storage = require("./storage.js")(),
    md5 = require("./md5.js")(),
    sync = require("./sync.js");

function getBufferByURLHash(urlhash){
  var dh,d;
  if (dh=storage.getItem(urlhash)){
    try{
      d=JSON.parse(storage.getItem(dh));
    }
    catch(err){
      throw err;
    }
  }
  else d=undefined;
  return d;
}

//function getBufferByURL(url){
  return getBufferByURLHash(md5(url));
}

module.exports={
  
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
    
    function Receive(res){
      handle(res,ToDOM);
    }
    
    function ToDOM(data){
      connection.clients.forEach(function(e,i,a){
        if (e.seamless) e.seamless(data);
      });
    }

    if (connection=this.connection(url)) return connection;
    
    // new connection
    
    buffer=getBufferByURLHash(rh);
    
    InitConnection=new Promise(function(success,error){
      var transmitter;
      
      if (Worker){
        var worker = new Worker(
          URL.createObjectURL(
            new Blob(require("./worker.js").code(url))
          )
        );
        worker.onerror = function(e){
          //worker.terminate();
          error(e);
        };
        worker.onmessage = function(e){
          if (e.data != "false") {
            Receive(e.data);
            success(connection);
          }
          else {
            alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            error(new Error("Connection lost"));
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
            Receive(args);
            success(connection);
          }
          else {
            alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            error(new Error("Connection lost"));
          }
        });
      }

      Transmit=function (data){
        handle(data,transmitter);
      };
    });
    
    return this.connections[rh]={
      url: url,
      hashes:{
        url: rh,
        get dataHash(){
          return storage.getItem(connection.hashes.url);
        }
      },
      get data(){
        return buffer;
      },
      clients: [],
      bindClients: function(elems){
        if (!(elems instanceof Array)) elems=[elems];
        elems.forEach(function(e,i,a){
          e.connecting=InitConnection.then(function(){
            if (e instanceof HTMLElement) {
              if (e.dataset.sync && (typeof e.dataset.sync === "function")){
                e.seamless= e.dataset.sync;
                e.deseamless= function(){
                  e.removeAttribute("data-sync");
                  delete this.seamless;
                };
              }
              else sync(buffer,e,Transmit);
            }
            else {
              if (typeof e === "object") {
                //TODO: seamless client-side reciever is a JS object
                e.__defineGetter__("status",function(){return buffer});
                e.__defineSetter__("status",Transmit);
              }
              else if (typeof e === "function") {
                a[i] = {
                  seamless: e,
                  deseamless: function(){
                    delete this.seamless;
                  }
                }
              }
            }
            delete e.connecting;
          })
          .catch(function(err){throw err});
          connection.clients.push(e);
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
              e.connecting.then(function(){
                e.deseamless();
              })
              .catch(function(err){
                throw err;
              });
            }
          }
        });
      }
    };
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