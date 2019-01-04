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
//# sourceMappingURL=socket.js.map