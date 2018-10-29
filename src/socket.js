export function socket(url, Rx) {
  var rt;
  var rc = 0;
  var ec = 0;
  var connect = (function reconnect() {
    return new Promise(function (resolve, reject) {
      var socket = new WebSocket(url);
      rt = setTimeout(socket.close, 9000);
      socket.onclose = function (e) {
        clearTimeout(rt);
        rc++;
        if (rc < 5)
          connect = reconnect();
        else
          reject(url + ' does not answer');
      };
      socket.onerror = function (e) {
        console.error(e);
        ec++;
        if (ec > 10) {
          ec = 0;
          socket.close();
        }
      };
      socket.onopen = function (e) {
        clearTimeout(rt);
        rc = 0;
        ec = 0;
        resolve(socket);
      };
      socket.onmessage = function (e) {
        Rx(e.data);
      };
    })["catch"](console.error);
  })();
  return function Tx(data) {
    connect.then(function (active_socket) {
      active_socket.send(data);
    });
  };
}
