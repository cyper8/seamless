
function workerFunction(url){
  var sendToServer;
  onmessage = function(e){
    if (sendToServer){
      sendToServer(e.data || e);
    }
    else{
      postMessage("");
    }
  };
  function respHandler(res){
    if (res){
      sendToServer = res.post;
      postMessage(res.data);
    }
    else {postMessage("false")};
  }
  if (!(url.search(/^wss?:\/\//i)<0) && WebSocket){
    require("./socket.js")(url,respHandler);
  }
  else{
    require("./poller.js")(url,respHandler);
  }
};

module.exports.code = function(url){
  var code = workerFunction.toString();
  var re = /([a-zA-Z_]*require[_]*)\(([^()]*)\)[^({ ;]*/m;
  var m;
  while((m = re.exec(code)) !== null){
    if (m.index === re.lastIndex) re.lastIndex++;
    
    var p = code.split(m[0]);
    var i = eval(m[0]+".toString()");
    code = p.join("("+i+")");
  }
  return ["(" + code + ")(\""+url+"\")"];
};
