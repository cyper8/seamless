export function socket(url: string,Rx: Function): Function {
  let rt: number;
  let rc: number = 0;
  let ec: number = 0;
  let connect: Promise<WebSocket|string> = (function reconnect(): Promise<WebSocket|string> {
    return new Promise(function(resolve,reject) {
      var socket: WebSocket = new WebSocket(url);
      rt = window.setTimeout(socket.close, 9000);
      socket.onclose = function() {
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
      socket.onopen = function() {
        clearTimeout(rt);
        rc = 0;
        ec = 0;
        resolve(socket);
      };
      socket.onmessage = function(e) {
        Rx(e.data);
      };
    });
  })();
  return function(data: string): void {
    connect.then(function(active_socket: WebSocket) {
      active_socket.send(data);
    });
  };
}
