export class Socket {
    constructor(url, receive) {
        this.__reconnectCount = 0;
        this.__errorCount = 0;
        this.__url = url;
        this.__receive = receive;
        this.__connection = this.__connect();
    }
    get transmitter() {
        return this.__connection.then(() => this.__send.bind(this));
    }
    __send(data) {
        this.__connection.then(function (active_socket) {
            active_socket.send(data);
        });
    }
    __connect() {
        return new Promise((resolve) => {
            this.socket = new WebSocket(this.__url);
            this.__timer = window.setTimeout(this.socket.close, 9000);
            this.socket.onclose = () => {
                clearTimeout(this.__timer);
                this.__reconnectCount++;
                if (this.__reconnectCount < 5)
                    this.__connection = this.__connect();
                else
                    throw new Error(this.__url + ' does not answer');
            };
            this.socket.onerror = (e) => {
                console.error(e);
                this.__errorCount++;
                if (this.__errorCount > 10) {
                    this.__errorCount = 0;
                    this.socket.close();
                }
            };
            this.socket.onopen = () => {
                clearTimeout(this.__timer);
                this.__reconnectCount = 0;
                this.__errorCount = 0;
                resolve(this.socket);
            };
            this.socket.onmessage = (e) => {
                let data;
                try {
                    data = JSON.parse(e.data);
                }
                catch (error) {
                    throw error;
                }
                if (data) {
                    this.__receive(data);
                }
            };
        });
    }
    close() {
        this.socket.onclose = undefined;
        this.socket.close();
    }
}
// export async function socket(url: URLString, Rx: Function): Promise<Function> {
//   let t: number;
//   let rc: number = 0;
//   let ec: number = 0;
//   let connection: Promise<WebSocket>;
//   connection = (function connect(): Promise<WebSocket> {
//     return new Promise<WebSocket>(function(resolve) {
//       var socket: WebSocket = new WebSocket(<string>url);
//       t = window.setTimeout(socket.close, 9000);
//       socket.onclose = function() {
//         clearTimeout(t);
//         rc++;
//         if (rc < 5) connection = connect();
//         else throw new Error(url+' does not answer');
//       };
//       socket.onerror = function(e) {
//         console.error(e);
//         ec++;
//         if (ec > 10) {
//           ec = 0;
//           socket.close();
//         }
//       };
//       socket.onopen = function() {
//         clearTimeout(t);
//         rc = 0;
//         ec = 0;
//         resolve(socket);
//       };
//       socket.onmessage = function(e) {
//         let data: Object;
//         try {
//           data = JSON.parse(e.data);
//         } catch(error) {
//           throw error;
//         }
//         if (data) {
//           Rx(data);
//         }
//       };
//     });
//   })();
//   await connection;
//   return function(data: Blob|string|ArrayBuffer): void {
//     connection.then(function(active_socket: WebSocket) {
//       active_socket.send(data);
//     });
//   };
// }
//# sourceMappingURL=socket.js.map