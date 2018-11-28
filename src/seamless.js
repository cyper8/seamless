var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { storage as storage_f } from './storage.js';
import { SeamlessSync } from './ssync.js';
import { socket } from './socket.js';
import { poller } from './poller.js';
import { ComplementUrl } from './utils/complement-url.js';
import { md5 as md5_mod } from './md5.js';
const md5 = md5_mod();
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
    return __awaiter(this, void 0, void 0, function* () {
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
        transmitter = yield (function (callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if ((!(url.search(/^wss?:\/\//i) < 0)) && WebSocket) {
                    return yield socket(url, callback);
                }
                else {
                    return yield poller(url.replace(/^ws/, "http"), callback);
                }
            });
        })(Receive);
        Transmit = function (data) {
            bufferedHandle(data, transmitter);
        };
        connection = {
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
                    elems = new Array(elems);
                }
                elems.forEach(function (e, i, a) {
                    function SeamlessDataChangeEventHandler(evt) {
                        Transmit(buffer);
                        evt.stopPropagation();
                    }
                    let seamless_prop = {
                        value: Function,
                        enumerable: true,
                        writable: true,
                    };
                    let deseamless_prop = {
                        value: function deseamless() {
                            delete this.seamless;
                            if (this.removeEventListener) {
                                this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                            }
                        }.bind(e),
                        enumerable: true,
                        writable: true,
                    };
                    let status_prop = {
                        get() {
                            return buffer;
                        },
                        set(v) {
                            Transmit(v);
                        },
                        enumerable: true,
                        writable: true,
                    };
                    if (e instanceof HTMLElement) {
                        e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                        if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                            seamless_prop.value = window[e.dataset.sync].bind(e);
                        }
                        else {
                            seamless_prop.value = SeamlessSync.bind(e);
                        }
                    }
                    else {
                        if (typeof e === "function") {
                            seamless_prop.value = e.bind(e);
                        }
                        else if (typeof e === "object") {
                            seamless_prop.value = false;
                        }
                    }
                    Object.defineProperties(e, {
                        seamless: seamless_prop,
                        deseamless: deseamless_prop,
                        status: status_prop,
                    });
                    e["seamless"](buffer);
                    connection.clients.push(a[i]);
                });
                return connection;
            },
            unbindClients: function (elems) {
                if (!elems)
                    elems = connection.clients;
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
    });
}
export const Seamless = {
    compile: function (dom) {
        let seamlessElements = dom.querySelectorAll("*[data-seamless]");
        for (let i = 0; i < seamlessElements.length; i++) {
            let el = seamlessElements[i];
            Seamless.connect(el.dataset.seamless).then((connection) => connection.bindClients([el]));
        }
        return Promise.all(Seamless.connections.values());
    },
    getConnection: function (endpoint) {
        let url = ComplementUrl(endpoint);
        return this.connections.get(md5(url));
    },
    connect: function (endpoint) {
        let connection = this.getConnection(endpoint);
        if (!connection) {
            connection = Connect(endpoint);
            Seamless.connections.set(connection.hashes.url, connection);
        }
        return connection;
    },
    disconnect: function (endpoint) {
        var url = ComplementUrl(endpoint);
        this.getConnection(url).unbindClients();
        return Seamless.connections.delete(md5(url));
    },
    connections: new Map([]),
};
//# sourceMappingURL=seamless.js.map