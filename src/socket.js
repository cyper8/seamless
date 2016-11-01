module.exports = function(url){
  return new Promise(function(success, error){
    var socket = new WebSocket(url);
    socket.onopen = function(e){
      if (e.data) {
        Response(e.data);
      }
    }
    socket.onerror = error;
    socket.onmessage = function(e){
      Response(e.data);
    }
    function Response(res){
      success({
        data: res,
        post: socket.send
      })
    }
  })

}