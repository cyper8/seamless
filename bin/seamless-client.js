var Seamless =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/basic-library/src/UI/Element.js":
/*!*******************************************************!*\
  !*** ../node_modules/basic-library/src/UI/Element.js ***!
  \*******************************************************/
/*! exports provided: element, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"element\", function() { return element; });\nfunction element(desc){\n    if (!desc) {throw new Error(\"Wrong argument\")};\n    var type = desc.match(/^[a-z][a-z0-9-]*/i);\n    var classes = desc.match(/\\.([a-z][a-z0-9_-]*)/ig) || [];\n    var id = desc.match(/\\#([a-z][a-z0-9_-]*)/i) || [];\n    var element = document.createElement(type[0]);\n    element.className = ((classes.length>0) ? (classes.join(\" \")) : (\"\")).replace(/\\./g,\"\");\n    element.id = (id.length>0) ? (id[0].replace(/\\#/,\"\")) : (\"\");\n    return element;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (element);\n\n//# sourceURL=webpack://Seamless/../node_modules/basic-library/src/UI/Element.js?");

/***/ }),

/***/ "./md5.js":
/*!****************!*\
  !*** ./md5.js ***!
  \****************/
/*! exports provided: md5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"md5\", function() { return md5; });\nfunction md5() {\n\n    function t(e, t) {\n        var n = (e & 65535) + (t & 65535),\n            r = (e >> 16) + (t >> 16) + (n >> 16);\n        return r << 16 | n & 65535;\n    }\n\n    function n(e, t) {\n        return e << t | e >>> 32 - t;\n    }\n\n    function r(e, r, i, s, o, u) {\n        return t(n(t(t(r, e), t(s, u)), o), i);\n    }\n\n    function i(e, t, n, i, s, o, u) {\n        return r(t & n | ~t & i, e, t, s, o, u);\n    }\n\n    function s(e, t, n, i, s, o, u) {\n        return r(t & i | n & ~i, e, t, s, o, u);\n    }\n\n    function o(e, t, n, i, s, o, u) {\n        return r(t ^ n ^ i, e, t, s, o, u);\n    }\n\n    function u(e, t, n, i, s, o, u) {\n        return r(n ^ (t | ~i), e, t, s, o, u);\n    }\n\n    function a(e, n) {\n        e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;\n        var r, a, f, l, c, h = 1732584193,\n            p = -271733879,\n            d = -1732584194,\n            v = 271733878;\n        for (r = 0; r < e.length; r += 16) a = h, f = p, l = d, c = v, h = i(h, p, d, v, e[r], 7, -680876936), v = i(v, h, p, d, e[r + 1], 12, -389564586), d = i(d, v, h, p, e[r + 2], 17, 606105819), p = i(p, d, v, h, e[r + 3], 22, -1044525330), h = i(h, p, d, v, e[r + 4], 7, -176418897), v = i(v, h, p, d, e[r + 5], 12, 1200080426), d = i(d, v, h, p, e[r + 6], 17, -1473231341), p = i(p, d, v, h, e[r + 7], 22, -45705983), h = i(h, p, d, v, e[r + 8], 7, 1770035416), v = i(v, h, p, d, e[r + 9], 12, -1958414417), d = i(d, v, h, p, e[r + 10], 17, -42063), p = i(p, d, v, h, e[r + 11], 22, -1990404162), h = i(h, p, d, v, e[r + 12], 7, 1804603682), v = i(v, h, p, d, e[r + 13], 12, -40341101), d = i(d, v, h, p, e[r + 14], 17, -1502002290), p = i(p, d, v, h, e[r + 15], 22, 1236535329), h = s(h, p, d, v, e[r + 1], 5, -165796510), v = s(v, h, p, d, e[r + 6], 9, -1069501632), d = s(d, v, h, p, e[r + 11], 14, 643717713), p = s(p, d, v, h, e[r], 20, -373897302), h = s(h, p, d, v, e[r + 5], 5, -701558691), v = s(v, h, p, d, e[r + 10], 9, 38016083), d = s(d, v, h, p, e[r + 15], 14, -660478335), p = s(p, d, v, h, e[r + 4], 20, -405537848), h = s(h, p, d, v, e[r + 9], 5, 568446438), v = s(v, h, p, d, e[r + 14], 9, -1019803690), d = s(d, v, h, p, e[r + 3], 14, -187363961), p = s(p, d, v, h, e[r + 8], 20, 1163531501), h = s(h, p, d, v, e[r + 13], 5, -1444681467), v = s(v, h, p, d, e[r + 2], 9, -51403784), d = s(d, v, h, p, e[r + 7], 14, 1735328473), p = s(p, d, v, h, e[r + 12], 20, -1926607734), h = o(h, p, d, v, e[r + 5], 4, -378558), v = o(v, h, p, d, e[r + 8], 11, -2022574463), d = o(d, v, h, p, e[r + 11], 16, 1839030562), p = o(p, d, v, h, e[r + 14], 23, -35309556), h = o(h, p, d, v, e[r + 1], 4, -1530992060), v = o(v, h, p, d, e[r + 4], 11, 1272893353), d = o(d, v, h, p, e[r + 7], 16, -155497632), p = o(p, d, v, h, e[r + 10], 23, -1094730640), h = o(h, p, d, v, e[r + 13], 4, 681279174), v = o(v, h, p, d, e[r], 11, -358537222), d = o(d, v, h, p, e[r + 3], 16, -722521979), p = o(p, d, v, h, e[r + 6], 23, 76029189), h = o(h, p, d, v, e[r + 9], 4, -640364487), v = o(v, h, p, d, e[r + 12], 11, -421815835), d = o(d, v, h, p, e[r + 15], 16, 530742520), p = o(p, d, v, h, e[r + 2], 23, -995338651), h = u(h, p, d, v, e[r], 6, -198630844), v = u(v, h, p, d, e[r + 7], 10, 1126891415), d = u(d, v, h, p, e[r + 14], 15, -1416354905), p = u(p, d, v, h, e[r + 5], 21, -57434055), h = u(h, p, d, v, e[r + 12], 6, 1700485571), v = u(v, h, p, d, e[r + 3], 10, -1894986606), d = u(d, v, h, p, e[r + 10], 15, -1051523), p = u(p, d, v, h, e[r + 1], 21, -2054922799), h = u(h, p, d, v, e[r + 8], 6, 1873313359), v = u(v, h, p, d, e[r + 15], 10, -30611744), d = u(d, v, h, p, e[r + 6], 15, -1560198380), p = u(p, d, v, h, e[r + 13], 21, 1309151649), h = u(h, p, d, v, e[r + 4], 6, -145523070), v = u(v, h, p, d, e[r + 11], 10, -1120210379), d = u(d, v, h, p, e[r + 2], 15, 718787259), p = u(p, d, v, h, e[r + 9], 21, -343485551), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);\n        return [h, p, d, v];\n    }\n\n    function f(e) {\n        var t, n = \"\";\n        for (t = 0; t < e.length * 32; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);\n        return n;\n    }\n\n    function l(e) {\n        var t, n = [];\n        n[(e.length >> 2) - 1] = undefined;\n        for (t = 0; t < n.length; t += 1) n[t] = 0;\n        for (t = 0; t < e.length * 8; t += 8) n[t >> 5] |= (e.charCodeAt(t / 8) & 255) << t % 32;\n        return n;\n    }\n\n    function c(e) {\n        return f(a(l(e), e.length * 8));\n    }\n\n    function h(e, t) {\n        var n, r = l(e),\n            i = [],\n            s = [],\n            o;\n        i[15] = s[15] = undefined, r.length > 16 && (r = a(r, e.length * 8));\n        for (n = 0; n < 16; n += 1) i[n] = r[n] ^ 909522486, s[n] = r[n] ^ 1549556828;\n        return o = a(i.concat(l(t)), 512 + t.length * 8), f(a(s.concat(o), 640))\n    }\n\n    function p(e) {\n        var t = \"0123456789abcdef\",\n            n = \"\",\n            r, i;\n        for (i = 0; i < e.length; i += 1) r = e.charCodeAt(i), n += t.charAt(r >>> 4 & 15) + t.charAt(r & 15);\n        return n;\n    }\n\n    function d(e) {\n        return unescape(encodeURIComponent(e));\n    }\n\n    function v(e) {\n        return c(d(e));\n    }\n\n    function m(e) {\n        return p(v(e));\n    }\n\n    function g(e, t) {\n        return h(d(e), d(t));\n    }\n\n    function y(e, t) {\n        return p(g(e, t));\n    }\n    return function(e, t, n) {\n        return t ? n ? g(t, e) : y(t, e) : n ? v(e) : m(e);\n    }\n}\n\n//# sourceURL=webpack://Seamless/./md5.js?");

/***/ }),

/***/ "./poller.js":
/*!*******************!*\
  !*** ./poller.js ***!
  \*******************/
/*! exports provided: poller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"poller\", function() { return poller; });\nfunction poller(url, Rx) {\n    var timer, rc = 0;\n    function request(url, data, Receiver) {\n        let connect;\n        let endpoint = encodeURI(url);\n        let options = {\n            method: (!data || data == '') ? 'GET' : 'POST',\n            headers: {\n                \"Accept\": \"application/json\"\n            }\n        };\n        if (options.method === 'POST') {\n            options[\"body\"] = data;\n            options.headers[\"Content-Type\"] = 'application/json';\n        }\n        if (fetch) {\n            connect = fetch(endpoint, options);\n        }\n        else {\n            connect = new Promise(function (resolve, reject) {\n                var xhr = new XMLHttpRequest();\n                xhr.addEventListener('readystatechange', function () {\n                    if (this.readyState == 4) {\n                        if (this.status == 200) {\n                            resolve(this.response);\n                        }\n                        else {\n                            this.abort();\n                            reject(this.status + ': Request Error');\n                        }\n                    }\n                });\n                xhr.addEventListener(\"error\", function (e) {\n                    this.abort();\n                    reject(e);\n                });\n                xhr.timeout = 30000;\n                xhr.addEventListener(\"timeout\", function () {\n                    if ((this.readyState > 0) && (this.readyState < 4))\n                        this.abort();\n                    reject(new Error(\"Request timed out!\"));\n                });\n                xhr.responseType = 'json';\n                xhr.open(options.method, endpoint, true);\n                for (let h in options.headers) {\n                    xhr.setRequestHeader(h, options.headers[h]);\n                }\n                xhr.send(data || '');\n            });\n        }\n        return connect.then(function (res) {\n            if (res)\n                Receiver(res);\n        }).catch(function (err) {\n            console.error(err);\n            Receiver(false);\n            rc++;\n            return err;\n        });\n    }\n    url = (url.search(/^https?:\\/\\//i) < 0) ?\n        url.replace(/^[^:]+:/i, \"http:\") :\n        url;\n    function poll() {\n        request(url, '', Rx)\n            .then(function () {\n            timer = setTimeout(poll, 1000);\n        })\n            .catch(function () {\n            if (rc > 5) {\n                clearTimeout(timer);\n                console.error(\"Poller connection lost. Reconnection constantly failing. Try reloading page.\");\n            }\n            else {\n                console.error(\"Reconnecting attempt \" + rc);\n                timer = setTimeout(poll, 1000);\n            }\n        });\n    }\n    request(url + '?nopoll=true', '', Rx)\n        .then(poll, poll);\n    function Post(d) {\n        request(url, (typeof d !== \"string\") ? JSON.stringify(d) : d, Rx);\n    }\n    return Post;\n}\n//# sourceMappingURL=poller.js.map\n\n//# sourceURL=webpack://Seamless/./poller.js?");

/***/ }),

/***/ "./seamless.js":
/*!*********************!*\
  !*** ./seamless.js ***!
  \*********************/
/*! exports provided: Seamless */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Seamless\", function() { return Seamless; });\n/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage.js */ \"./storage.js\");\n/* harmony import */ var _ssync_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ssync.js */ \"./ssync.js\");\n/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./socket.js */ \"./socket.js\");\n/* harmony import */ var _poller_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./poller.js */ \"./poller.js\");\n/* harmony import */ var _utils_complement_url_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/complement-url.js */ \"./utils/complement-url.js\");\n/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./md5.js */ \"./md5.js\");\n\n\n\n\n\n\nconst md5 = Object(_md5_js__WEBPACK_IMPORTED_MODULE_5__[\"md5\"])();\nconst storage = Object(_storage_js__WEBPACK_IMPORTED_MODULE_0__[\"storage\"])();\nfunction getBufferByURLHash(urlhash) {\n    let h = storage.getItem(urlhash);\n    let d;\n    if (h) {\n        try {\n            d = JSON.parse(storage.getItem(h));\n        }\n        catch (err) {\n            throw err;\n        }\n    }\n    else {\n        d = undefined;\n    }\n    return d;\n}\nfunction Connect(endpoint) {\n    let url = Object(_utils_complement_url_js__WEBPACK_IMPORTED_MODULE_4__[\"ComplementUrl\"])(endpoint);\n    let rh = md5(url);\n    let connection;\n    let buffer = getBufferByURLHash(rh);\n    let transmitter;\n    let Transmit;\n    let Receive;\n    function bufferedHandle(data, to) {\n        let d;\n        let odh = storage.getItem(rh);\n        if (typeof data !== \"string\") {\n            try {\n                d = JSON.stringify(data);\n            }\n            catch (err) {\n                throw err;\n            }\n        }\n        else {\n            try {\n                d = data;\n                data = JSON.parse(d);\n            }\n            catch (err) {\n                throw err;\n            }\n        }\n        to(buffer = data);\n        let dh = md5(d);\n        if (odh !== dh) {\n            storage.removeItem(odh);\n            storage.setItem(dh, d);\n            storage.setItem(rh, dh);\n        }\n    }\n    Receive = function (res) {\n        var data = (res.data) ? res.data : res;\n        if (data && data != \"false\") {\n            bufferedHandle(data, ToDOM);\n        }\n        else {\n            throw new Error(\"Connection lost.\");\n        }\n    };\n    function ToDOM(data) {\n        connection.clients.forEach(function (e) {\n            if (e.seamless)\n                e.seamless(data);\n            else\n                e.status = data;\n        });\n    }\n    transmitter = (function (callback) {\n        if ((!(url.search(/^wss?:\\/\\//i) < 0)) && WebSocket) {\n            return Object(_socket_js__WEBPACK_IMPORTED_MODULE_2__[\"socket\"])(url, callback);\n        }\n        else {\n            return Object(_poller_js__WEBPACK_IMPORTED_MODULE_3__[\"poller\"])(url.replace(/^ws/, \"http\"), callback);\n        }\n    })(Receive);\n    Transmit = function (data) {\n        bufferedHandle(data, transmitter);\n    };\n    this.connections[rh] = connection = {\n        url: url,\n        hashes: {\n            url: rh,\n            get dataHash() {\n                return storage.getItem(connection.hashes.url);\n            }\n        },\n        get data() {\n            return buffer;\n        },\n        set data(d) {\n            Transmit(d);\n        },\n        clients: [],\n        bindClients: function (elems) {\n            if (!(elems instanceof Array)) {\n                elems = [elems];\n            }\n            // in each Element\n            elems.forEach(function (e, i, a) {\n                function SeamlessDataChangeEventHandler(evt) {\n                    Transmit(buffer);\n                    evt.stopPropagation();\n                }\n                // set connection field to connection object - what for?\n                // e.connection = connection;\n                if (e instanceof HTMLElement) {\n                    e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);\n                    // set seamless function which must be called to update bided elements\n                    if (e.dataset.sync && (typeof window[e.dataset.sync] === \"function\")) {\n                        e.seamless = window[e.dataset.sync].bind(e);\n                    }\n                    else {\n                        e.seamless = _ssync_js__WEBPACK_IMPORTED_MODULE_1__[\"SeamlessSync\"].bind(e);\n                    }\n                    // set deseamles function which unbindes client elements\n                    e.deseamless = function () {\n                        this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);\n                        delete this.seamless;\n                        // delete this.connection;\n                    }.bind(e);\n                    e.seamless(buffer, Transmit);\n                }\n                else {\n                    if (typeof e === \"object\") {\n                        Object.defineProperty(e, \"status\", {\n                            get() {\n                                return buffer;\n                            },\n                            set(v) {\n                                Transmit(v);\n                            },\n                            enumerable: true\n                        });\n                    }\n                    else if (typeof e === \"function\") {\n                        a[i] = {\n                            // connection: connection,\n                            status: buffer,\n                            seamless: e.bind(a[i]),\n                            deseamless: function () {\n                                delete this.seamless;\n                                delete this.connection;\n                            }\n                        };\n                    }\n                    e.status = buffer;\n                }\n                connection.clients.push(e);\n            });\n            return connection;\n        },\n        unbindClients: function (elems) {\n            if (!elems)\n                elems = connection.clients;\n            if (!(elems instanceof Array))\n                elems = [elems];\n            elems.forEach(function (e) {\n                var index = connection.clients.indexOf(e);\n                if (index >= 0) {\n                    e = connection.clients.splice(index, 1)[0];\n                    if (e.deseamless)\n                        e.deseamless();\n                }\n            });\n            return connection;\n        }\n    };\n    return connection;\n}\nconst Seamless = {\n    compile: function (dom) {\n        let seamlessElements = dom.querySelectorAll(\"*[data-seamless]\");\n        let connections = [];\n        for (let i = 0; i < seamlessElements.length; i++) {\n            let el = seamlessElements[i];\n            connections.push(this.with(el.dataset.seamless).bindClients(el));\n        }\n        return connections;\n    },\n    getConnection: function (endpoint) {\n        let url = Object(_utils_complement_url_js__WEBPACK_IMPORTED_MODULE_4__[\"ComplementUrl\"])(endpoint);\n        return this.connections[md5(url)];\n    },\n    connect: function (endpoint) {\n        return this.getConnection(endpoint) || Connect(endpoint);\n    },\n    disconnect: function (endpoint) {\n        var url = Object(_utils_complement_url_js__WEBPACK_IMPORTED_MODULE_4__[\"ComplementUrl\"])(endpoint);\n        this.getConnection(url).unbindClients();\n        delete this.connections[md5(url)];\n    },\n    connections: {},\n};\n//# sourceMappingURL=seamless.js.map\n\n//# sourceURL=webpack://Seamless/./seamless.js?");

/***/ }),

/***/ "./socket.js":
/*!*******************!*\
  !*** ./socket.js ***!
  \*******************/
/*! exports provided: socket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"socket\", function() { return socket; });\nfunction socket(url, Rx) {\n    let t;\n    let rc = 0;\n    let ec = 0;\n    let connect = (function reconnect() {\n        return new Promise(function (resolve) {\n            var socket = new WebSocket(url);\n            t = window.setTimeout(socket.close, 9000);\n            socket.onclose = function () {\n                clearTimeout(t);\n                rc++;\n                if (rc < 5)\n                    connect = reconnect();\n                else\n                    throw new Error(url + ' does not answer');\n            };\n            socket.onerror = function (e) {\n                console.error(e);\n                ec++;\n                if (ec > 10) {\n                    ec = 0;\n                    socket.close();\n                }\n            };\n            socket.onopen = function () {\n                clearTimeout(t);\n                rc = 0;\n                ec = 0;\n                resolve(socket);\n            };\n            socket.onmessage = function (e) {\n                Rx(e.data);\n            };\n        });\n    })();\n    return function (data) {\n        connect.then(function (active_socket) {\n            active_socket.send(data);\n        });\n    };\n}\n//# sourceMappingURL=socket.js.map\n\n//# sourceURL=webpack://Seamless/./socket.js?");

/***/ }),

/***/ "./ssync.js":
/*!******************!*\
  !*** ./ssync.js ***!
  \******************/
/*! exports provided: SeamlessSync */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SeamlessSync\", function() { return SeamlessSync; });\n/* harmony import */ var _node_modules_basic_library_src_UI_Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/basic-library/src/UI/Element.js */ \"../node_modules/basic-library/src/UI/Element.js\");\n/* harmony import */ var _utils_debounced_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/debounced.js */ \"./utils/debounced.js\");\n\n\nfunction getElements(id, el) {\n    var r = [];\n    for (var i = 0; i < el.length; i++) {\n        var e = el[i].querySelectorAll(\"#\" + id);\n        if (e.length == 0) {\n            (e = []).push(el[i].appendChild(Object(_node_modules_basic_library_src_UI_Element_js__WEBPACK_IMPORTED_MODULE_0__[\"element\"])(\"div#\" + id)));\n        }\n        for (var j = 0; j < e.length; j++) {\n            r.push(e[j]);\n        }\n    }\n    return r;\n}\nfunction SeamlessSync(data) {\n    var key;\n    for (key in data) {\n        if ((key == \"_id\") || (typeof data[key] === \"boolean\")) {\n            this.setAttribute(key, data[key]);\n        }\n        else {\n            switch (typeof data[key]) {\n                case \"number\":\n                case \"string\":\n                    getElements(key, [this]).forEach(function (e) {\n                        if (e instanceof HTMLInputElement) {\n                            e.value = data[key];\n                            if (!e.onchange) {\n                                e.onchange = Object(_utils_debounced_js__WEBPACK_IMPORTED_MODULE_1__[\"Debounced\"])(function () {\n                                    data[this.id] = this.value;\n                                    this.dispatchEvent(new CustomEvent('seamlessdatachange', { bubbles: true }));\n                                }, 1000);\n                            }\n                        }\n                        else\n                            e.innerText = data[key];\n                    });\n                    break;\n                case \"object\":\n                    getElements(key, this).forEach(function (e) {\n                        SeamlessSync.apply(e, data[key]);\n                    });\n            }\n        }\n    }\n}\n//# sourceMappingURL=ssync.js.map\n\n//# sourceURL=webpack://Seamless/./ssync.js?");

/***/ }),

/***/ "./storage.js":
/*!********************!*\
  !*** ./storage.js ***!
  \********************/
/*! exports provided: storage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"storage\", function() { return storage; });\n/*  global localStorage, CustomEvent  */\nfunction storage() {\n    function storageAvailable(type) {\n        try {\n            var storage = window[type], x = '__storage_test__';\n            storage.setItem(x, x);\n            storage.removeItem(x);\n            return true;\n        }\n        catch (e) {\n            return false;\n        }\n    }\n    if (storageAvailable('localStorage')) {\n        return window.localStorage;\n    }\n    else {\n        return Object.defineProperties({}, {\n            'setItem': {\n                value: function (k, v) {\n                    var e = new CustomEvent('storage', { detail: {\n                            key: k,\n                            oldValue: this[k],\n                            newValue: v,\n                            storageArea: this\n                        } });\n                    this[k] = v;\n                    (window || self).dispatchEvent(e);\n                    return v;\n                }\n            },\n            'getItem': {\n                value: function (k) {\n                    return this[k] || null;\n                }\n            },\n            'removeItem': {\n                value: function (k) {\n                    delete this[k];\n                    return this;\n                }\n            },\n            'key': {\n                value: function (n) {\n                    var i, c = 0;\n                    for (i in this) {\n                        if (c == n)\n                            return this[i];\n                        c++;\n                    }\n                }\n            },\n            'clear': {\n                value: function () {\n                    var i;\n                    for (i in this) {\n                        this.removeItem(i);\n                    }\n                    return this;\n                }\n            },\n            'length': {\n                get: function () {\n                    var i, c = 0;\n                    for (i in this) {\n                        c++;\n                    }\n                    return c;\n                }\n            }\n        });\n    }\n}\n//# sourceMappingURL=storage.js.map\n\n//# sourceURL=webpack://Seamless/./storage.js?");

/***/ }),

/***/ "./utils/complement-url.js":
/*!*********************************!*\
  !*** ./utils/complement-url.js ***!
  \*********************************/
/*! exports provided: ComplementUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ComplementUrl\", function() { return ComplementUrl; });\nfunction ComplementUrl(url) {\n    let proto;\n    let host;\n    let p = url.split(\"/\");\n    if (p[0].search(/:$/) == -1) {\n        proto = window.location.protocol + \"//\";\n    }\n    else {\n        proto = p[0] + \"//\";\n        p = p.slice(2);\n    }\n    if ((p.length == 1) || (p[0].search(/^[a-z][a-z0-9]*\\./i) == -1)) {\n        host = window.location.host;\n        if (p[0] == \"\")\n            p.shift();\n    }\n    else {\n        host = p.shift();\n    }\n    return proto + host + \"/\" + p.join(\"/\");\n}\n//# sourceMappingURL=complement-url.js.map\n\n//# sourceURL=webpack://Seamless/./utils/complement-url.js?");

/***/ }),

/***/ "./utils/debounced.js":
/*!****************************!*\
  !*** ./utils/debounced.js ***!
  \****************************/
/*! exports provided: Debounced */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Debounced\", function() { return Debounced; });\nfunction Debounced(func,backoff) {\n\tvar timer;\n\treturn function(){\n\t\tvar self = this;\n\t\tvar evtargs = arguments;\n\t\tif (timer){\n\t\t\tclearTimeout(timer);\n\t\t\ttimer = undefined;\n\t\t}\n\t\ttimer = setTimeout(function(){\n\t\t\tclearTimeout(timer);\n\t\t\ttimer = undefined;\n\t\t\tfunc.apply(self,evtargs);\n\t\t},backoff);\n\t};\n}\n\n\n//# sourceURL=webpack://Seamless/./utils/debounced.js?");

/***/ }),

/***/ 0:
/*!*************************!*\
  !*** multi seamless.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! seamless.js */\"./seamless.js\");\n\n\n//# sourceURL=webpack://Seamless/multi_seamless.js?");

/***/ })

/******/ })["Seamless"];