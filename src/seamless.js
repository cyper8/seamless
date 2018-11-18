"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var storage_1 = require("./storage");
var ssync_1 = require("./ssync");
var socket_1 = require("./socket");
var poller_1 = require("./poller");
var complement_url_js_1 = require("./utils/complement-url.js");
var md5_js_1 = require("./md5.js");
var md5 = md5_js_1.md5();
function Seamless() {
    var storage = storage_1.storage();
    function getBufferByURLHash(urlhash) {
        var dh = storage.getItem(urlhash);
        var d;
        if (dh) {
            try {
                d = JSON.parse(storage.getItem(dh));
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
        var url = complement_url_js_1.ComplementUrl(endpoint);
        var rh = md5(url);
        var connection;
        // let connection: Connection = this.getConnection(url);
        var buffer = getBufferByURLHash(rh);
        var InitConnection;
        // if (connection) return connection;
        // new connection
        InitConnection = new Promise(function (resolve) {
            var transmitter;
            var Transmit;
            var Receive;
            function bufferedHandle(data, to) {
                var d;
                var odh = storage.getItem(rh);
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
                var dh = md5(d);
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
                    resolve(Transmit);
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
                    return socket_1.socket(url, callback);
                }
                else {
                    return poller_1.poller(url.replace(/^ws/, "http"), callback);
                }
            })(Receive);
            Transmit = function (data) {
                bufferedHandle(data, transmitter);
            };
        });
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
            clients: [],
            bindClients: function (elems) {
                if (!(elems instanceof Array)) {
                    elems = [elems];
                }
                elems.forEach(function (e, i, a) {
                    e.connection = InitConnection
                        .then(function (transmit) {
                        function SeamlessDataChangeEventHandler(evt) {
                            transmit(buffer);
                            evt.stopPropagation();
                        }
                        if (e instanceof HTMLElement) {
                            e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                            if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                                e.seamless = window[e.dataset.sync].bind(e);
                            }
                            else {
                                e.seamless = ssync_1.SeamlessSync.bind(e);
                            }
                            e.deseamless = function () {
                                this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                                delete this.seamless;
                                delete this.connection;
                            }.bind(e);
                            e.seamless(buffer, transmit);
                        }
                        else {
                            if (typeof e === "object") {
                                Object.defineProperty(e, "status", {
                                    get: function () {
                                        return buffer;
                                    },
                                    set: function (v) {
                                        transmit(v);
                                    },
                                    enumerable: true
                                });
                            }
                            else if (typeof e === "function") {
                                a[i] = {
                                    connection: InitConnection,
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
                        return transmit;
                    });
                    connection.clients.push(e);
                });
                return InitConnection;
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
                        else {
                            e.connection.then(function () {
                                e.deseamless();
                            });
                        }
                    }
                });
                return InitConnection;
            }
        };
        return connection;
    }
    return {
        compile: function (dom) {
            return __awaiter(this, void 0, void 0, function () {
                var seamlessElements, connections, i, el;
                return __generator(this, function (_a) {
                    seamlessElements = dom.querySelectorAll("*[data-seamless]");
                    connections = [];
                    for (i = 0; i < seamlessElements.length; i++) {
                        el = seamlessElements[i];
                        connections.push(this["with"](el.dataset.seamless).bindClients(el));
                    }
                    return [2 /*return*/, Promise.all(connections)];
                });
            });
        },
        getConnection: function (endpoint) {
            var url = complement_url_js_1.ComplementUrl(endpoint);
            return this.connections[md5(url)];
        },
        connect: function (endpoint) {
            return this.getConnection(endpoint) || Connect(endpoint);
        },
        disconnect: function (endpoint) {
            var url = complement_url_js_1.ComplementUrl(endpoint);
            this.getConnection(url).unbindClients();
            delete this.connections[md5(url)];
        },
        connections: {}
    };
}
exports.Seamless = Seamless;
