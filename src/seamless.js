import { storage as storage_f } from './storage';
import { SeamlessSync } from './ssync';
import { socket } from './socket';
import { poller } from './poller';
import { ComplementUrl } from './utils/complement-url.js';
import { md5 as md5_mod } from './md5.js';
const md5 = md5_mod();
export function Seamless() {
    const storage = storage_f();
    function getBufferByURLHash(urlhash) {
        let h = storage.getItem(urlhash);
        let d;
        if (h) {
            try {
                d = JSON.parse(storage.getItem(h));
            }
            catch (err) {
                throw err;
            }
        }
        else {
            d = undefined;
        }
        return d;
    }
    function Connect(endpoint) {
        let url = ComplementUrl(endpoint);
        let rh = md5(url);
        let connection;
        let buffer = getBufferByURLHash(rh);
        let transmitter;
        let Transmit;
        let Receive;
        function bufferedHandle(data, to) {
            let d;
            let odh = storage.getItem(rh);
            if (typeof data !== "string") {
                try {
                    d = JSON.stringify(data);
                }
                catch (err) {
                    throw err;
                }
            }
            else {
                try {
                    d = data;
                    data = JSON.parse(d);
                }
                catch (err) {
                    throw err;
                }
            }
            to(buffer = data);
            let dh = md5(d);
            if (odh !== dh) {
                storage.removeItem(odh);
                storage.setItem(dh, d);
                storage.setItem(rh, dh);
            }
        }
        Receive = function (res) {
            var data = (res.data) ? res.data : res;
            if (data && data != "false") {
                bufferedHandle(data, ToDOM);
            }
            else {
                throw new Error("Connection lost.");
            }
        };
        function ToDOM(data) {
            connection.clients.forEach(function (e) {
                if (e.seamless)
                    e.seamless(data);
                else
                    e.status = data;
            });
        }
        transmitter = (function (callback) {
            if ((!(url.search(/^wss?:\/\//i) < 0)) && WebSocket) {
                return socket(url, callback);
            }
            else {
                return poller(url.replace(/^ws/, "http"), callback);
            }
        })(Receive);
        Transmit = function (data) {
            bufferedHandle(data, transmitter);
        };
        this.connections[rh] = connection = {
            url: url,
            hashes: {
                url: rh,
                get dataHash() {
                    return storage.getItem(connection.hashes.url);
                }
            },
            get data() {
                return buffer;
            },
            set data(d) {
                Transmit(d);
            },
            clients: [],
            bindClients: function (elems) {
                if (!(elems instanceof Array)) {
                    elems = [elems];
                }
                elems.forEach(function (e, i, a) {
                    e.connection = connection;
                    function SeamlessDataChangeEventHandler(evt) {
                        Transmit(buffer);
                        evt.stopPropagation();
                    }
                    if (e instanceof HTMLElement) {
                        e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                        if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                            e.seamless = window[e.dataset.sync].bind(e);
                        }
                        else {
                            e.seamless = SeamlessSync.bind(e);
                        }
                        e.deseamless = function () {
                            this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                            delete this.seamless;
                            delete this.connection;
                        }.bind(e);
                        e.seamless(buffer, Transmit);
                    }
                    else {
                        if (typeof e === "object") {
                            Object.defineProperty(e, "status", {
                                get() {
                                    return buffer;
                                },
                                set(v) {
                                    Transmit(v);
                                },
                                enumerable: true
                            });
                        }
                        else if (typeof e === "function") {
                            a[i] = {
                                connection: connection,
                                status: buffer,
                                seamless: e,
                                deseamless: function () {
                                    delete this.seamless;
                                    delete this.connection;
                                }
                            };
                        }
                        e.status = buffer;
                    }
                    connection.clients.push(e);
                });
                return connection;
            },
            unbindClients: function (elems) {
                if (!elems)
                    elems = connection.clients;
                if (!(elems instanceof Array))
                    elems = [elems];
                elems.forEach(function (e) {
                    var index = connection.clients.indexOf(e);
                    if (index >= 0) {
                        e = connection.clients.splice(index, 1)[0];
                        if (e.deseamless)
                            e.deseamless();
                    }
                });
                return connection;
            }
        };
        return connection;
    }
    return {
        compile: function (dom) {
            let seamlessElements = dom.querySelectorAll("*[data-seamless]");
            let connections = [];
            for (let i = 0; i < seamlessElements.length; i++) {
                let el = seamlessElements[i];
                connections.push(this.with(el.dataset.seamless).bindClients(el));
            }
            return connections;
        },
        getConnection: function (endpoint) {
            let url = ComplementUrl(endpoint);
            return this.connections[md5(url)];
        },
        connect: function (endpoint) {
            return this.getConnection(endpoint) || Connect(endpoint);
        },
        disconnect: function (endpoint) {
            var url = ComplementUrl(endpoint);
            this.getConnection(url).unbindClients();
            delete this.connections[md5(url)];
        },
        connections: {},
    };
}
//# sourceMappingURL=seamless.js.map