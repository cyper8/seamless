module.exports = function(url, Rx) {
  var ct,
    rt,
    rc = 0,
    ec = 0;

  function connect() {
    return new Promise(function(resolve, reject) {
      function ConnectionTimeout() {
        socket.close();
        reject(new Error("WS: Connection attempt failure"));
      }

      var socket = new WebSocket(url);
      ct = setTimeout(ConnectionTimeout, 9000);
      console.log("WS:New connection to " + url);
      socket.onclose = function(e) {
        console.log("WS:Connection to " + url + " closed.");
      };
      socket.onopen = function(e) {
        clearTimeout(ct);
        rc = 0;
        if (e.data) {
          Rx(e.data);
        }
        resolve(socket);
      };
      socket.onerror = function(error) {
        console.error(error);
        ec++;
        if (ec > 5) {
          socket.close();
          console.log("WS:Too many errors. Reconnecting");
          reject(error);
          ec = 0;
        }
      };
      socket.onmessage = function(e) {
        Rx(e.data);
      };
    });
  }

  function createConnection() {
    return connect()
      .catch(function(err) {
        return new Promise(function(resolve, reject) {
          if (rc > 5) reject(new Error("WS:Socket connection lost. Reconnection constantly failing. Try reloading page."));
          else {
            console.error(err);
            rc++;
            rt = setInterval(resolve, 10000);
          }
        })
          .then(createConnection)
          .catch(console.error);
      });
  }

  var connection = createConnection();

  return function(d) {
    connection.then(function(socket) {
      socket.send(
        (typeof d !== "string") ?
          JSON.stringify(d) :
          d
      );
    });
  };
};