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
  addEndpoint:function(endpoint,callback){
    var rh = md5(endpoint);
    
    if (window.Seamless[rh]) {
      callback(window.Seamless[rh]);
    }
    else if (Worker) {
      var worker;
//      return new Promise(
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
          };
        })(callback);
//      )
//      .then(callback)
//      .catch(function(err){
//        console.error(err);
//      });
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
        callback(processResponse(rh,res));
      });
    }
  },
  removeEndpoint:function(endpoint){
    delete window.Seamless[md5(endpoint)];
  }
};