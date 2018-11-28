var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function socket(url, Rx) {
    return __awaiter(this, void 0, void 0, function* () {
        let t;
        let rc = 0;
        let ec = 0;
        let connection = (function connect() {
            return new Promise(function (resolve) {
                var socket = new WebSocket(url);
                t = window.setTimeout(socket.close, 9000);
                socket.onclose = function () {
                    clearTimeout(t);
                    rc++;
                    if (rc < 5)
                        connection = connect();
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
        yield connection;
        return function (data) {
            connection.then(function (active_socket) {
                active_socket.send(data);
            });
        };
    });
}
//# sourceMappingURL=socket.js.map