function socket(url: string,Rx: Function): Function {
  var rt: number;
  var rc: number = 0;
  var ec: number = 0;
  var connect: Promise<any> = (function reconnect(): Promise<any> {
    return new Promise(function(resolve,reject) {
      var socket: WebSocket = new WebSocket(url);
      rt = setTimeout(socket.close, 9000);
      socket.onclose = function(e) {
        clearTimeout(rt);
        rc++;
        if (rc < 5) connect = reconnect();
        else reject(url+' does not answer');
      };
      socket.onerror = function(e) {
        console.error(e);
        ec++;
        if (ec > 10) {
          ec = 0;
          socket.close();
        }
      };
      socket.onopen = function(e) {
        clearTimeout(rt);
        rc = 0;
        ec = 0;
        resolve(socket);
      };
      socket.onmessage = function(e) {
        Rx(e.data);
      };
    })
    .catch(console.error);
  })();
  return function(data: string){
    connect.then(function(active_socket: WebSocket) {
      active_socket.send(data);
    });
  };
}