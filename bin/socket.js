export function socket(url, Rx) {
    let rt;
    let rc = 0;
    let ec = 0;
    let connect = (function reconnect() {
        return new Promise(function (resolve, reject) {
            var socket = new WebSocket(url);
            rt = window.setTimeout(socket.close, 9000);
            socket.onclose = function () {
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
            socket.onopen = function () {
                clearTimeout(rt);
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