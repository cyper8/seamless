module.exports = function(url,callback){
  var callback = callback;
  (function createConnection(success){
    var socket = new WebSocket(url);
    socket.onopen = function(e){
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
          disconnect: socket.close,
          reconnect: function(){
            socket.close();
            createConnection(success);
          }
        }
      });
    }
  })(callback);
};