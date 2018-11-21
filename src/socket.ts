
export function socket(url: string, Rx: Function): Function {
  let t: number;
  let rc: number = 0;
  let ec: number = 0;
  let connect: Promise<WebSocket> = (function reconnect(): Promise<WebSocket> {
    return new Promise<WebSocket>(function(resolve) {
      var socket: WebSocket = new WebSocket(url);
      t = window.setTimeout(socket.close, 9000);
      socket.onclose = function() {
        clearTimeout(t);
        rc++;
        if (rc < 5) connect = reconnect();
        else throw new Error(url+' does not answer');
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
        clearTimeout(t);
        rc = 0;
        ec = 0;
        resolve(socket);
      };
      socket.onmessage = function(e) {
        Rx(e.data);
      };
    });
  })();
  return function(data: Blob|string|ArrayBuffer): void {
    connect.then(function(active_socket: WebSocket) {
      active_socket.send(data);
    });
  };
}
