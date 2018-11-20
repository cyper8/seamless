export function socket(url, Rx) {
    let t;
    let rc = 0;
    let ec = 0;
    let connect = (function reconnect() {
        return new Promise(function (resolve) {
            var socket = new WebSocket(url);
            t = window.setTimeout(socket.close, 9000);
            socket.onclose = function () {
                clearTimeout(t);
                rc++;
                if (rc < 5)
                    connect = reconnect();
                else
                    throw new Error(url + ' does not answer');
            };
            socket.onerror = function (e) {
                console.error(e);
                ec++;
                if (ec > 10) {
                    ec = 0;
                    socket.close();
                }
            };
            socket.onopen = function () {
                clearTimeout(t);
                rc = 0;
                ec = 0;
                resolve(socket);
            };
            socket.onmessage = function (e) {
                Rx(e.data);
            };
        });
    })();
    return function (data) {
        connect.then(function (active_socket) {
            active_socket.send(data);
        });
    };
}
//# sourceMappingURL=socket.js.map