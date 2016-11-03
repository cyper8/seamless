module.exports = function(url,callback){
  var socket,ct,rt,rc=0,callback = callback;
  (function createConnection(success){
    socket = new WebSocket(url);
    ct=setTimeout(socket.close,9000);
    console.log("New connection to "+url+". Status:"+socket.readyState);
    socket.onclose = function(e){
      console.log("Connection to "+url+" closed.");
    };
    socket.onopen = function(e){
      clearTimeout(ct);
      rc=0;
      if (e.data) {
        console.log("worker: websocket: "+e.data);
        Response(e.data);
      }
    };
    socket.onerror = console.error;
    socket.onmessage = function(e){
      Response(e.data);
    };
    function Response(res){
      success({
        data: res,
        post: socket.send.bind(socket),
        connection: {
          disconnect: function(){
            if(rt)clearInterval(rt);
            socket.close();
          },
          reconnect: socket.close
        }
      });
    }
    if (!rt){// WATCHDOG
      rt=setInterval(
        function(){
          if (socket){
            if (socket.readyState == 3){
              createConnection(success);
              rc++;
            }
          }
          if (rc>5){
            clearInterval(rt);
          }
        }, 10000);
    }
  })(callback);
};