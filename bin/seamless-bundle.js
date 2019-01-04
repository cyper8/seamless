var Seamless = (function (exports) {
    'use strict';

    function md5() {

        function t(e, t) {
            var n = (e & 65535) + (t & 65535),
                r = (e >> 16) + (t >> 16) + (n >> 16);
            return r << 16 | n & 65535;
        }

        function n(e, t) {
            return e << t | e >>> 32 - t;
        }

        function r(e, r, i, s, o, u) {
            return t(n(t(t(r, e), t(s, u)), o), i);
        }

        function i(e, t, n, i, s, o, u) {
            return r(t & n | ~t & i, e, t, s, o, u);
        }

        function s(e, t, n, i, s, o, u) {
            return r(t & i | n & ~i, e, t, s, o, u);
        }

        function o(e, t, n, i, s, o, u) {
            return r(t ^ n ^ i, e, t, s, o, u);
        }

        function u(e, t, n, i, s, o, u) {
            return r(n ^ (t | ~i), e, t, s, o, u);
        }

        function a(e, n) {
            e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;
            var r, a, f, l, c, h = 1732584193,
                p = -271733879,
                d = -1732584194,
                v = 271733878;
            for (r = 0; r < e.length; r += 16) a = h, f = p, l = d, c = v, h = i(h, p, d, v, e[r], 7, -680876936), v = i(v, h, p, d, e[r + 1], 12, -389564586), d = i(d, v, h, p, e[r + 2], 17, 606105819), p = i(p, d, v, h, e[r + 3], 22, -1044525330), h = i(h, p, d, v, e[r + 4], 7, -176418897), v = i(v, h, p, d, e[r + 5], 12, 1200080426), d = i(d, v, h, p, e[r + 6], 17, -1473231341), p = i(p, d, v, h, e[r + 7], 22, -45705983), h = i(h, p, d, v, e[r + 8], 7, 1770035416), v = i(v, h, p, d, e[r + 9], 12, -1958414417), d = i(d, v, h, p, e[r + 10], 17, -42063), p = i(p, d, v, h, e[r + 11], 22, -1990404162), h = i(h, p, d, v, e[r + 12], 7, 1804603682), v = i(v, h, p, d, e[r + 13], 12, -40341101), d = i(d, v, h, p, e[r + 14], 17, -1502002290), p = i(p, d, v, h, e[r + 15], 22, 1236535329), h = s(h, p, d, v, e[r + 1], 5, -165796510), v = s(v, h, p, d, e[r + 6], 9, -1069501632), d = s(d, v, h, p, e[r + 11], 14, 643717713), p = s(p, d, v, h, e[r], 20, -373897302), h = s(h, p, d, v, e[r + 5], 5, -701558691), v = s(v, h, p, d, e[r + 10], 9, 38016083), d = s(d, v, h, p, e[r + 15], 14, -660478335), p = s(p, d, v, h, e[r + 4], 20, -405537848), h = s(h, p, d, v, e[r + 9], 5, 568446438), v = s(v, h, p, d, e[r + 14], 9, -1019803690), d = s(d, v, h, p, e[r + 3], 14, -187363961), p = s(p, d, v, h, e[r + 8], 20, 1163531501), h = s(h, p, d, v, e[r + 13], 5, -1444681467), v = s(v, h, p, d, e[r + 2], 9, -51403784), d = s(d, v, h, p, e[r + 7], 14, 1735328473), p = s(p, d, v, h, e[r + 12], 20, -1926607734), h = o(h, p, d, v, e[r + 5], 4, -378558), v = o(v, h, p, d, e[r + 8], 11, -2022574463), d = o(d, v, h, p, e[r + 11], 16, 1839030562), p = o(p, d, v, h, e[r + 14], 23, -35309556), h = o(h, p, d, v, e[r + 1], 4, -1530992060), v = o(v, h, p, d, e[r + 4], 11, 1272893353), d = o(d, v, h, p, e[r + 7], 16, -155497632), p = o(p, d, v, h, e[r + 10], 23, -1094730640), h = o(h, p, d, v, e[r + 13], 4, 681279174), v = o(v, h, p, d, e[r], 11, -358537222), d = o(d, v, h, p, e[r + 3], 16, -722521979), p = o(p, d, v, h, e[r + 6], 23, 76029189), h = o(h, p, d, v, e[r + 9], 4, -640364487), v = o(v, h, p, d, e[r + 12], 11, -421815835), d = o(d, v, h, p, e[r + 15], 16, 530742520), p = o(p, d, v, h, e[r + 2], 23, -995338651), h = u(h, p, d, v, e[r], 6, -198630844), v = u(v, h, p, d, e[r + 7], 10, 1126891415), d = u(d, v, h, p, e[r + 14], 15, -1416354905), p = u(p, d, v, h, e[r + 5], 21, -57434055), h = u(h, p, d, v, e[r + 12], 6, 1700485571), v = u(v, h, p, d, e[r + 3], 10, -1894986606), d = u(d, v, h, p, e[r + 10], 15, -1051523), p = u(p, d, v, h, e[r + 1], 21, -2054922799), h = u(h, p, d, v, e[r + 8], 6, 1873313359), v = u(v, h, p, d, e[r + 15], 10, -30611744), d = u(d, v, h, p, e[r + 6], 15, -1560198380), p = u(p, d, v, h, e[r + 13], 21, 1309151649), h = u(h, p, d, v, e[r + 4], 6, -145523070), v = u(v, h, p, d, e[r + 11], 10, -1120210379), d = u(d, v, h, p, e[r + 2], 15, 718787259), p = u(p, d, v, h, e[r + 9], 21, -343485551), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
            return [h, p, d, v];
        }

        function f(e) {
            var t, n = "";
            for (t = 0; t < e.length * 32; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
            return n;
        }

        function l(e) {
            var t, n = [];
            n[(e.length >> 2) - 1] = undefined;
            for (t = 0; t < n.length; t += 1) n[t] = 0;
            for (t = 0; t < e.length * 8; t += 8) n[t >> 5] |= (e.charCodeAt(t / 8) & 255) << t % 32;
            return n;
        }

        function c(e) {
            return f(a(l(e), e.length * 8));
        }

        function h(e, t) {
            var n, r = l(e),
                i = [],
                s = [],
                o;
            i[15] = s[15] = undefined, r.length > 16 && (r = a(r, e.length * 8));
            for (n = 0; n < 16; n += 1) i[n] = r[n] ^ 909522486, s[n] = r[n] ^ 1549556828;
            return o = a(i.concat(l(t)), 512 + t.length * 8), f(a(s.concat(o), 640))
        }

        function p(e) {
            var t = "0123456789abcdef",
                n = "",
                r, i;
            for (i = 0; i < e.length; i += 1) r = e.charCodeAt(i), n += t.charAt(r >>> 4 & 15) + t.charAt(r & 15);
            return n;
        }

        function d(e) {
            return unescape(encodeURIComponent(e));
        }

        function v(e) {
            return c(d(e));
        }

        function m(e) {
            return p(v(e));
        }

        function g(e, t) {
            return h(d(e), d(t));
        }

        function y(e, t) {
            return p(g(e, t));
        }
        return function(e, t, n) {
            return t ? n ? g(t, e) : y(t, e) : n ? v(e) : m(e);
        }
    }

    function ComplementUrl(url) {
        let proto;
        let host;
        let validUrl;
        let p = url.split("/");
        if (p[0].search(/:$/) !== -1) { // schema in 0 element
            proto = p.shift();
        }
        else { // no schema in 0 element
            proto = window.location.protocol;
            if (p[0] === '')
                p.shift();
        }
        if (p[0] === '') { //
            p.shift();
            host = p.shift();
        }
        if (!host || (host === '')) {
            host = window.location.host;
        }
        validUrl = encodeURI(`${proto}//${host}/${p.join('/')}`);
        if (new URL(validUrl)) {
            return validUrl;
        }
    }

    /*  global localStorage, CustomEvent  */
    function storage() {
        function storageAvailable(type) {
            try {
                var storage = window[type], x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        if (storageAvailable('localStorage')) {
            return window.localStorage;
        }
        else {
            return Object.defineProperties({}, {
                'setItem': {
                    value: function (k, v) {
                        var e = new StorageEvent('storage', {
                            key: k,
                            oldValue: this[k],
                            newValue: v,
                            storageArea: this
                        });
                        this[k] = v;
                        (window || self).dispatchEvent(e);
                        return v; // incompatible with Storage interface - it should return void
                    }
                },
                'getItem': {
                    value: function (k) {
                        return this[k] || null;
                    }
                },
                'removeItem': {
                    value: function (k) {
                        let v = this[k];
                        delete this[k];
                        window.dispatchEvent((new StorageEvent('storage', {
                            key: k,
                            oldValue: v,
                            newValue: undefined,
                            storageArea: this
                        })));
                        return this;
                    }
                },
                'key': {
                    value: function (n) {
                        var i, c = 0;
                        for (i in this) {
                            if (c == n)
                                return this[i];
                            c++;
                        }
                    }
                },
                'clear': {
                    value: function () {
                        var i;
                        for (i in this) {
                            this.removeItem(i);
                        }
                        return this;
                    }
                },
                'length': {
                    get: function () {
                        var i, c = 0;
                        for (i in this) {
                            c++;
                        }
                        return c;
                    }
                }
            });
        }
    }

    const MD5 = md5();
    const STORAGE = storage();
    class Buffer {
        constructor(url) {
            this.hash = MD5(url);
            this.__init();
        }
        __init() {
            this.datahash = Promise.resolve(STORAGE.getItem(this.hash));
            return this.__retrieve().then(() => this);
        }
        read() {
            return Promise.race([
                this.cache,
                this.__retrieve()
            ]);
        }
        __retrieve() {
            return this.datahash
                .then((dh) => this.__cache(STORAGE.getItem(dh) || ''));
        }
        __cache(data) {
            let d;
            if (data !== '') {
                try {
                    d = JSON.parse(data);
                }
                catch (error) {
                    console.error(error);
                }
            }
            return (this.cache = d);
        }
        write(v) {
            let val;
            try {
                val = JSON.stringify(v);
            }
            catch (error) {
                console.error(error);
                val = '';
            }
            let dh = MD5(val);
            return this.datahash.then((odh) => {
                if (dh !== odh) {
                    this.datahash = Promise.resolve(STORAGE.removeItem(odh))
                        .then(() => {
                        this.__cache(val);
                        STORAGE.setItem(dh, val);
                        STORAGE.setItem(this.hash, dh);
                        return dh;
                    });
                }
                return v;
            });
        }
        get data() {
            if (this.cache instanceof Object) {
                return this.cache;
            }
            else {
                return undefined;
            }
        }
        set data(v) {
            this.write(v);
        }
        clear() {
            return this.datahash
                .then((dh) => {
                STORAGE.removeItem(dh);
                STORAGE.removeItem(this.hash);
            })
                .then(() => this.__init());
        }
    }

    class Socket {
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

    function AbortableFetch(url, options) {
        let abortController = new AbortController();
        let abortSignal = abortController.signal;
        options.signal = abortSignal;
        return {
            request: Promise.race([
                fetch(url, options).then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    else {
                        throw new Error(res.status.toString());
                    }
                }),
                new Promise((_, reject) => setTimeout(() => {
                    abortController.abort();
                    reject(new Error('Fetch timeout reached. Request aborted.'));
                }, 30000)),
            ]),
            abort() {
                abortController.abort();
            }
        };
    }

    function ajax(url, options) {
        let data = options.body;
        let xhr;
        return {
            request: (new Promise(function (resolve, reject) {
                xhr = new XMLHttpRequest();
                const Abort = function () {
                    reject(new Error('Request cancelled'));
                }.bind(xhr);
                const Expire = function () {
                    reject(new Error('Connection timeout reached'));
                    if ((this.readyState > 0) && (this.readyState < 4)) {
                        this.abort();
                    }
                }.bind(xhr);
                const Report = function (error) {
                    reject(error);
                    if ((this.readyState > 0) && (this.readyState < 4)) {
                        this.abort();
                    }
                }.bind(xhr);
                xhr.timeout = 30000;
                xhr.addEventListener('readystatechange', function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve(this.response);
                        }
                    }
                });
                xhr.addEventListener("error", Report);
                xhr.addEventListener("timeout", Expire);
                xhr.addEventListener('abort', Abort);
                xhr.responseType = 'json';
                xhr.open(options.method, url, true);
                for (let h in options.headers) {
                    xhr.setRequestHeader(h, options.headers[h]);
                }
                xhr.send(data || '');
            })),
            abort() {
                xhr.abort();
            }
        };
    }

    class Poller {
        constructor(url, receiver) {
            this.__reconnectCount = 0;
            this.__url = (url.search(/^https?:\/\//i) < 0) ?
                url.replace(/^[^:]+:/i, "http:") :
                url;
            this.__receiver = receiver;
            this.__init()
                .then(() => this.__poll());
        }
        __request(url, data) {
            console.log(url);
            let request;
            let options = {
                method: (!data || data == '') ? 'GET' : 'POST',
                headers: {
                    "Accept": "application/json"
                },
            };
            if (options.method === 'POST') {
                options.body = data;
                options.headers["Content-Type"] = 'application/json';
            }
            if (fetch && AbortController) {
                request = AbortableFetch(url, options);
            }
            else {
                request = ajax(url, options);
            }
            this.request = request;
            return request.request
                .then((response) => {
                this.__receiver(response);
            });
        }
        __Post(d) {
            return this.__request(this.__url, (typeof d !== "string") ? JSON.stringify(d) : d);
        }
        __init() {
            let resolver;
            let rejector;
            console.log('initializing');
            this.transmitter = new Promise((resolve, reject) => {
                [resolver, rejector] = [resolve, reject];
            });
            return this.__request(this.__url + '?nopoll=true', '')
                .then(() => {
                resolver(this.__Post.bind(this));
                console.log('initialized');
            }, (err) => {
                console.error(`Connection Initialization failed:`, err);
                rejector(err);
            });
        }
        __poll() {
            console.log('polling');
            return this.__request(this.__url, '')
                .then(() => {
                this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
            })
                .catch((err) => {
                console.error(`Connection polling failure: `, err);
                if (this.__reconnectCount > 5) {
                    window.clearTimeout(this.__timer);
                    this.__reconnectCount = 0;
                    console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
                    this.transmitter = Promise.reject(err);
                }
                else {
                    console.error("Reconnecting attempt " + this.__reconnectCount++);
                    this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
                }
            });
        }
        close() {
            this.request.abort();
        }
    }

    class Channel {
        get egress() {
            return this.__backend.transmitter;
        }
        close() {
            this.__backend.close();
        }
        constructor(url, ingress) {
            if (((url.search(/^wss?:\/\//i) >= 0)) && WebSocket) {
                this.__backend = new Socket(url, ingress);
            }
            else {
                this.__backend = new Poller(url.replace(/^ws/, "http"), ingress);
            }
        }
    }

    function element(desc){
        if (!desc) {throw new Error("Wrong argument")}    var type = desc.match(/^[a-z][a-z0-9-]*/i);
        var classes = desc.match(/\.([a-z][a-z0-9_-]*)/ig) || [];
        var id = desc.match(/\#([a-z][a-z0-9_-]*)/i) || [];
        var element = document.createElement(type[0]);
        element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
        element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
        return element;
    }

    function Debounced(func,backoff) {
    	var timer;
    	return function(){
    		var self = this;
    		var evtargs = arguments;
    		if (timer){
    			clearTimeout(timer);
    			timer = undefined;
    		}
    		timer = setTimeout(function(){
    			clearTimeout(timer);
    			timer = undefined;
    			(func||(function(){})).apply(self,evtargs);
    		},backoff||0);
    	};
    }

    function getElements(id, el) {
        var r = [];
        for (var i = 0; i < el.length; i++) {
            var e = el[i].querySelectorAll("#" + id);
            if (e.length == 0) {
                (e = []).push(el[i].appendChild(element("div#" + id)));
            }
            for (var j = 0; j < e.length; j++) {
                r.push(e[j]);
            }
        }
        return r;
    }
    function SeamlessSync(data) {
        var key;
        for (key in data) {
            if ((key == "_id") || (typeof data[key] === "boolean")) {
                this.setAttribute(key, data[key]);
            }
            else {
                switch (typeof data[key]) {
                    case "number":
                    case "string":
                        getElements(key, [this]).forEach(function (e) {
                            if (e instanceof HTMLInputElement) {
                                e.value = data[key];
                                if (!e.onchange) {
                                    e.onchange = Debounced(function () {
                                        data[this.id] = this.value;
                                        this.dispatchEvent(new CustomEvent('seamlessdatachange', { bubbles: true }));
                                    }, 1000);
                                }
                            }
                            else
                                e.innerText = data[key];
                        });
                        break;
                    case "object":
                        getElements(key, [this]).forEach(function (e) {
                            SeamlessSync.apply(e, data[key]);
                        });
                }
            }
        }
    }

    class SeamlessClient {
        constructor(element, transmit, buffer) {
            function SeamlessDataChangeEventHandler(evt) {
                transmit(buffer);
                evt.stopPropagation();
            }
            let seamless = {
                value: Function,
                enumerable: true,
                configurable: true,
            };
            let deseamless = {
                value: function deseamless() {
                    if (this.seamless !== undefined) {
                        delete this.seamless;
                        if (this.removeEventListener) {
                            this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                        }
                    }
                    if (this.status) {
                        delete this.status;
                    }
                }.bind(this),
                enumerable: true,
                configurable: true,
            };
            let status = {
                get() {
                    return buffer;
                },
                set(v) {
                    transmit(v);
                },
                enumerable: true,
                configurable: true,
            };
            if (element instanceof HTMLElement) {
                element.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                if (element.dataset.sync &&
                    (typeof window[element.dataset.sync] === "function")) {
                    seamless.value = window[element.dataset.sync].bind(element);
                }
                else {
                    seamless.value = SeamlessSync.bind(element);
                }
            }
            else {
                if (typeof element === "function") {
                    seamless.value = element.bind(element);
                }
                else if (typeof element === "object") {
                    seamless.value = false;
                }
            }
            let props = {
                seamless,
                deseamless,
                status,
            };
            Object.defineProperties(this, props);
            if (this.seamless)
                this.seamless(buffer, transmit);
        }
    }

    class Connection {
        constructor(url) {
            this.clients = [];
            this.to(url);
        }
        __ToDOM(data) {
            this.clients.forEach(function (client) {
                if (client.seamless)
                    client.seamless(data);
                else
                    client.status = data;
            });
        }
        __receiver(response) {
            this.__buffer.write(response).then((data) => this.__ToDOM(data));
        }
        __transmit(data) {
            return Promise.all([
                this.__transmitter,
                this.__buffer.write(data)
            ]).then(([transmitter, data]) => {
                return transmitter(data);
            });
        }
        get __transmitter() {
            return this.__channel.egress;
        }
        to(url) {
            if (this.__channel) {
                this.close();
            }
            this.url = ComplementUrl(url);
            this.__buffer = new Buffer(this.url);
            this.__channel = new Channel(this.url, this.__receiver.bind(this));
            return this;
        }
        get established() {
            return new Promise((resolve) => {
                this.__transmitter.then(() => {
                    resolve(this);
                });
            });
        }
        close() {
            this.__channel.close();
            return this;
        }
        bindClients(elements) {
            this.clients = elements.map((element) => new SeamlessClient(element, this.__transmit.bind(this), this.__buffer.data));
            return this;
        }
        unbindClients(elements) {
            let elems = elements || this.clients;
            elems.forEach((e) => {
                let index = this.clients.indexOf(e);
                if (index >= 0) {
                    let el = this.clients.splice(index, 1)[0];
                    if (el.deseamless)
                        el.deseamless();
                }
            });
            return this;
        }
    }

    const MD5$1 = md5();
    const Seamless = {
        connections: new Map(),
        compile(root) {
            let clients = root.querySelectorAll('*[data-seamless]');
            let new_connections = [];
            for (let i = 0; i < clients.length; i++) {
                let clientNode = clients[i];
                new_connections.push(Seamless.connect(clientNode.dataset.seamless)
                    .bindClients([clientNode])
                    .established);
            }
            return Promise.all(new_connections);
        },
        getConnection(endpoint) {
            let url = ComplementUrl(endpoint);
            return Seamless.connections.get(MD5$1(url));
        },
        connect(endpoint) {
            let connection = Seamless.getConnection(endpoint);
            if (!connection) {
                connection = new Connection(endpoint);
                Seamless.connections.set(MD5$1(connection.url), connection);
            }
            return connection;
        },
        disconnect(endpoint) {
            let connection = Seamless.getConnection(endpoint);
            connection.unbindClients();
            connection.close();
            return Seamless.connections.delete(MD5$1(connection.url));
        },
        shutdown() {
            let endpoint;
            for (endpoint in Seamless.connections.keys) {
                Seamless.disconnect(endpoint);
            }
        }
    };

    exports.Seamless = Seamless;

    return exports;

}({}));
