/* global URL, Blob, Worker */
//var getWorkerCode = require("worker.js");
var storage = require("./storage.js")(),
    md5 = require("./md5.js")();
  
function setData(r,d){
  var m=md5,s=storage;
  var rh = r; //current route hash
  var dh = m(d); //new data hash
  var cd = s.getItem(rh); //old data hash
  if (cd == null){  //no data for route
    s.setItem(rh,dh);
    s.setItem(dh,d);
  }
  else if (cd == dh) return cd; //data not changed
  else {                          //
    s.removeItem(cd);       //rm old data
    s.setItem(rh,dh);       //correct pointer
    s.setItem(dh,d);        //correct data
  }
  return dh;            // return data hash
}

function processResponse(rh,r){
  var dh = setData(rh,r.data);
  return window.Seamless[rh] = Object.defineProperties(
    {
      connection: r.connection
    },
    {
      route: {
        value: rh
      },
      hash: {
        value: dh
      },
      data:{
        get: function(){
          return JSON.parse(storage.getItem(this.hash));
        },
        set: function(d){
          var data = (typeof d !== "string")?
            (JSON.stringify(d)):
            d;
          r.post(data);
        }
      },
    }
  );
}
  
window.Seamless = {
  storage: storage,
  getByRoute:function(url){
    return this[md5(url)];
  },
  connect:function(endpoint,callback){
    var rh = md5(endpoint);
    
    if (this[rh]) {
      callback(this[rh]);
    }
    else {
      var dh;
      if ((dh=storage.getItem(rh)) !== null){
        callback(this[rh]={
          route: rh,
          hash: dh,
          get data(){
            return JSON.parse(storage.getItem(this.hash));
          },
          set data(v){
            
          },
          connection: {
            disconnect:function(){
              delete window.Seamless[this.route];
            }
          }
        });
      }
      if (Worker) {
        var worker;
        (function createConnection(success){
          worker = new Worker(
            URL.createObjectURL(
              new Blob(require("./worker.js").code(endpoint))
            )
          );
          worker.onerror = function(e){
            worker.terminate();
            console.error(e);
          };
          worker.onmessage = function(e){
            if (e.data != "false") {
              success(processResponse(rh,{
                data: e.data,
                post: worker.postMessage.bind(worker),
                connection: {
                  disconnect: worker.terminate,
                  reconnect: function(){
                    worker.terminate();
                    createConnection(success);
                  }
                }
              }));
            }
            else {
              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            }
          };
        })(callback);
      }
      else {
        (function(success){
          if (WebSocket){
            require("./socket.js")(endpoint,success);
          }
          else {
            require("./poller.js")(endpoint,success);
          }
        })(function(res){
          if (res){
            callback(processResponse(rh,res));
          }
          else {
            alert("Connection lost. Reconnection constantly failing. Try reloading page.");
          }
        });
      }
    }
  },
  disconnect:function(endpoint){
    window.Seamless[md5(endpoint)].connection.disconnect();
    delete window.Seamless[md5(endpoint)];
  }
};