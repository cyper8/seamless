module.exports = function(url, Rx) {
  var ct, rt, rc = 0,
    ec = 0;
  var Tx = (function createConnection(success) {
    var socket = new WebSocket(url);
    ct = setTimeout(socket.close, 9000);
    console.log("New connection to " + url);
    socket.onclose = function(e) {
      console.log("Connection to " + url + " closed.");
    };
    socket.onopen = function(e) {
      clearTimeout(ct);
      rc = 0;
      if (e.data) {
        Response(e.data);
      }
    };
    socket.onerror = function(err) {
      console.error(err);
      ec++;
      if (ec > 10) {
        socket.close();
        console.log("Too many errors. Reconnecting");
        ec = 0;
      }
    };
    socket.onmessage = function(e) {
      Response(e.data);
    };

    function Response(res) {
      success(res);
    }
    if (!rt) { // WATCHDOG
      rt = setInterval(
        function() {
          if (socket) {
            if (socket.readyState == 3) { // CLOSED
              Tx = createConnection(success);
              rc++;
            }
          }
          if (rc > 5) {
            clearInterval(rt);
            alert(" Socket connection lost. Reconnection constantly failing. Try reloading page.") ||
              success(false);
          }
        }, 10000);
    }
    return function(d) {
      socket.send(
        (typeof d !== "string") ?
        JSON.stringify(d) :
        d
      )
    };
  })(Rx);
  return Tx;
};
