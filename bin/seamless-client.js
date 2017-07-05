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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* global URL, Blob, Worker, HTMLElement */
var storage = __webpack_require__(6)(),
  md5 = __webpack_require__(2)(),
  sync = __webpack_require__(5),
  Seamless;


function getBufferByURLHash(urlhash) {
  var dh,
    d;
  if (dh = storage.getItem(urlhash)) {
    try {
      d = JSON.parse(storage.getItem(dh));
    } catch (err) {
      throw err;
    }
  }
  else
    d = undefined;
  return d;
}

function ComplementUrl(url) {
  var proto,
    host,
    p = url.split("/");
  if (p[0].search(/:$/) == -1) {
    proto = window.location.protocol + "//";
  } else {
    proto = p[0] + "//";
    p = p.slice(2);
  }
  if ((p.length == 1) || (p[0].search(/^[a-z][a-z0-9]*\./i) == -1)) {
    host = window.location.host;
    if (p[0] == "") p.shift();
  } else {
    host = p.shift();
  }
  return proto + host + "/" + p.join("/");
}

module.exports = exports = Seamless = window.Seamless = {

  compile: function(dom) {
    var seamlessElements = dom.querySelectorAll("*[data-seamless]");
    var connections = [];
    for (var i = 0; i < seamlessElements.length; i++) {
      var el = seamlessElements[i];
      connections.push(this.with(el.dataset.seamless).bindClients(el));
    }
    return Promise.all(connections);
  },

  getConnection: function(endpoint) {
    var url = ComplementUrl(endpoint);
    return this.connections[md5(url)] || false;
  },

  with: function(endpoint) { // connection object closure
    var url = ComplementUrl(endpoint);
    var rh = md5(url),
      connection,
      buffer,
      InitConnection;

    if (connection = this.getConnection(url)) return connection;

    // new connection

    buffer = getBufferByURLHash(rh);

    InitConnection = new Promise(function(resolve, reject) {
      var transmitter,
        Transmit,
        Receive;

      function bufferedHandle(data, to) {
        var d,
          odh = storage.getItem(rh);

        if (typeof data !== "string") {
          try {
            d = JSON.stringify(data);
          } catch (err) {
            throw err;
          }
        } else {
          try {
            d = data;
            data = JSON.parse(d);
          } catch (err) {
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

      Receive = function(res) {
        var data = (res.data) ? res.data : res;
        if (data && data != "false") {
          bufferedHandle(data, ToDOM);
          resolve(Transmit);
        } else {
          reject(new Error("Connection lost."));
        }
      };

      function ToDOM(data) {
        connection.clients.forEach(function(e, i, a) {
          if (e.seamless) e.seamless(data);
          else
            e.status = data;
        });
      }

      transmitter = (function(callback) {
        if (!(url.search(/^wss?:\/\//i) < 0) && WebSocket) {
          return __webpack_require__(4)(url, callback);
        } else {
          return __webpack_require__(3)(url.replace(/^ws/, "http"), callback);
        }
      })(Receive);

      Transmit = function(data) {
        bufferedHandle(data, transmitter);
      };
    })
      .catch(function(err) {
        console.error(err);
      });

    return this.connections[rh] = connection = {
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
      bindClients: function(elems) {
        if (!(elems instanceof Array))
          elems = [elems];
        elems.forEach(function(e, i, a) {
          e.connection = InitConnection
            .then(function(transmit) {
              function SeamlessDataChangeEventHandler(evt) {
                transmit(buffer);
                evt.stopPropagation();
              }
              if (e instanceof HTMLElement) {
                e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                  e.seamless = window[e.dataset.sync].bind(e);
                } else {
                  e.seamless = sync.bind(e);
                }
                e.deseamless = function() {
                  this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                  delete this.seamless;
                  delete this.connection;
                }.bind(e);
                e.seamless(buffer, transmit);
              } else {
                if (typeof e === "object") {
                  e.__defineGetter__("status", function() {
                    return buffer
                  });
                  e.__defineSetter__("status", transmit);
                } else if (typeof e === "function") {
                  a[i] = {
                    seamless: e,
                    deseamless: function() {
                      delete this.seamless;
                      delete this.connection;
                    }
                  }
                }
                e.status = buffer;
              }
              return transmit;
            })
            .catch(function(err) {
              throw err
            });
          connection.clients.push(e);
        });
        return InitConnection;
      },
      unbindClients: function(elems) {
        if (!elems)
          elems = connection.clients;
        if (!(elems instanceof Array))
          elems = [elems];
        elems.forEach(function(e, i, a) {
          var index = connection.clients.indexOf(e);
          if (index >= 0) {
            var e = connection.clients.splice(index, 1);
            if (e.deseamless) e.deseamless();
            else {
              e.connecting.then(function() {
                e.deseamless();
              })
                .catch(function(err) {
                  throw err;
                });
            }
          }
        });
        return InitConnection;
      }
    };
  },

  disconnect: function(endpoint) {
    var url = ComplementUrl(endpoint);
    this.getConnection(url).unbindClients();
    delete this.getConnection(url);
  },

  connections: {},
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["element"] = element;
function element(desc){
    if (!desc) {throw new Error("Wrong argument")};
    var type = desc.match(/^[a-z][a-z0-9-]*/i);
    var classes = desc.match(/\.([a-z][a-z0-9_-]*)/ig) || [];
    var id = desc.match(/\#([a-z][a-z0-9_-]*)/i) || [];
    var element = document.createElement(type[0]);
    element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
    element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
    return element;
};

/* harmony default export */ __webpack_exports__["default"] = (element);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function() {

    function t(e, t) {
        var n = (e & 65535) + (t & 65535),
            r = (e >> 16) + (t >> 16) + (n >> 16);
        return r << 16 | n & 65535
    }

    function n(e, t) {
        return e << t | e >>> 32 - t
    }

    function r(e, r, i, s, o, u) {
        return t(n(t(t(r, e), t(s, u)), o), i)
    }

    function i(e, t, n, i, s, o, u) {
        return r(t & n | ~t & i, e, t, s, o, u)
    }

    function s(e, t, n, i, s, o, u) {
        return r(t & i | n & ~i, e, t, s, o, u)
    }

    function o(e, t, n, i, s, o, u) {
        return r(t ^ n ^ i, e, t, s, o, u)
    }

    function u(e, t, n, i, s, o, u) {
        return r(n ^ (t | ~i), e, t, s, o, u)
    }

    function a(e, n) {
        e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;
        var r, a, f, l, c, h = 1732584193,
            p = -271733879,
            d = -1732584194,
            v = 271733878;
        for (r = 0; r < e.length; r += 16) a = h, f = p, l = d, c = v, h = i(h, p, d, v, e[r], 7, -680876936), v = i(v, h, p, d, e[r + 1], 12, -389564586), d = i(d, v, h, p, e[r + 2], 17, 606105819), p = i(p, d, v, h, e[r + 3], 22, -1044525330), h = i(h, p, d, v, e[r + 4], 7, -176418897), v = i(v, h, p, d, e[r + 5], 12, 1200080426), d = i(d, v, h, p, e[r + 6], 17, -1473231341), p = i(p, d, v, h, e[r + 7], 22, -45705983), h = i(h, p, d, v, e[r + 8], 7, 1770035416), v = i(v, h, p, d, e[r + 9], 12, -1958414417), d = i(d, v, h, p, e[r + 10], 17, -42063), p = i(p, d, v, h, e[r + 11], 22, -1990404162), h = i(h, p, d, v, e[r + 12], 7, 1804603682), v = i(v, h, p, d, e[r + 13], 12, -40341101), d = i(d, v, h, p, e[r + 14], 17, -1502002290), p = i(p, d, v, h, e[r + 15], 22, 1236535329), h = s(h, p, d, v, e[r + 1], 5, -165796510), v = s(v, h, p, d, e[r + 6], 9, -1069501632), d = s(d, v, h, p, e[r + 11], 14, 643717713), p = s(p, d, v, h, e[r], 20, -373897302), h = s(h, p, d, v, e[r + 5], 5, -701558691), v = s(v, h, p, d, e[r + 10], 9, 38016083), d = s(d, v, h, p, e[r + 15], 14, -660478335), p = s(p, d, v, h, e[r + 4], 20, -405537848), h = s(h, p, d, v, e[r + 9], 5, 568446438), v = s(v, h, p, d, e[r + 14], 9, -1019803690), d = s(d, v, h, p, e[r + 3], 14, -187363961), p = s(p, d, v, h, e[r + 8], 20, 1163531501), h = s(h, p, d, v, e[r + 13], 5, -1444681467), v = s(v, h, p, d, e[r + 2], 9, -51403784), d = s(d, v, h, p, e[r + 7], 14, 1735328473), p = s(p, d, v, h, e[r + 12], 20, -1926607734), h = o(h, p, d, v, e[r + 5], 4, -378558), v = o(v, h, p, d, e[r + 8], 11, -2022574463), d = o(d, v, h, p, e[r + 11], 16, 1839030562), p = o(p, d, v, h, e[r + 14], 23, -35309556), h = o(h, p, d, v, e[r + 1], 4, -1530992060), v = o(v, h, p, d, e[r + 4], 11, 1272893353), d = o(d, v, h, p, e[r + 7], 16, -155497632), p = o(p, d, v, h, e[r + 10], 23, -1094730640), h = o(h, p, d, v, e[r + 13], 4, 681279174), v = o(v, h, p, d, e[r], 11, -358537222), d = o(d, v, h, p, e[r + 3], 16, -722521979), p = o(p, d, v, h, e[r + 6], 23, 76029189), h = o(h, p, d, v, e[r + 9], 4, -640364487), v = o(v, h, p, d, e[r + 12], 11, -421815835), d = o(d, v, h, p, e[r + 15], 16, 530742520), p = o(p, d, v, h, e[r + 2], 23, -995338651), h = u(h, p, d, v, e[r], 6, -198630844), v = u(v, h, p, d, e[r + 7], 10, 1126891415), d = u(d, v, h, p, e[r + 14], 15, -1416354905), p = u(p, d, v, h, e[r + 5], 21, -57434055), h = u(h, p, d, v, e[r + 12], 6, 1700485571), v = u(v, h, p, d, e[r + 3], 10, -1894986606), d = u(d, v, h, p, e[r + 10], 15, -1051523), p = u(p, d, v, h, e[r + 1], 21, -2054922799), h = u(h, p, d, v, e[r + 8], 6, 1873313359), v = u(v, h, p, d, e[r + 15], 10, -30611744), d = u(d, v, h, p, e[r + 6], 15, -1560198380), p = u(p, d, v, h, e[r + 13], 21, 1309151649), h = u(h, p, d, v, e[r + 4], 6, -145523070), v = u(v, h, p, d, e[r + 11], 10, -1120210379), d = u(d, v, h, p, e[r + 2], 15, 718787259), p = u(p, d, v, h, e[r + 9], 21, -343485551), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
        return [h, p, d, v]
    }

    function f(e) {
        var t, n = "";
        for (t = 0; t < e.length * 32; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return n
    }

    function l(e) {
        var t, n = [];
        n[(e.length >> 2) - 1] = undefined;
        for (t = 0; t < n.length; t += 1) n[t] = 0;
        for (t = 0; t < e.length * 8; t += 8) n[t >> 5] |= (e.charCodeAt(t / 8) & 255) << t % 32;
        return n
    }

    function c(e) {
        return f(a(l(e), e.length * 8))
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
        return n
    }

    function d(e) {
        return unescape(encodeURIComponent(e))
    }

    function v(e) {
        return c(d(e))
    }

    function m(e) {
        return p(v(e))
    }

    function g(e, t) {
        return h(d(e), d(t))
    }

    function y(e, t) {
        return p(g(e, t))
    }
    return function(e, t, n) {
        return t ? n ? g(t, e) : y(t, e) : n ? v(e) : m(e)
    }
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(url, Rx) {
  var timer,
    rc = 0;

  function request(url, data, Receiver) {
    return new Promise(function(resolve, reject) {
      var verb = (!data || data == '') ? 'GET' : 'POST';
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function(e) {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            this.abort();
            reject(this.status + ': Request Error');
          }
        }
      });
      xhr.addEventListener("error", function(e) {
        this.abort();
        reject(e);
      });
      xhr.timeout = 30000;
      xhr.addEventListener("timeout", function() {
        if ((this.readyState > 0) && (this.readyState < 4))
          this.abort();
        reject(new Error("Request timed out!"));
      });
      xhr.responseType = 'json';
      (xhr.executesession = function() {
        xhr.open(verb, encodeURI(url), true);
        xhr.setRequestHeader('Accept', 'application/json');
        if (verb == 'POST') xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data || '');
      })();
    }).then(function(res) {
      if (res) Receiver(res);
    }).catch(function(err) {
      console.error(err);
      Receiver(false);
      rc++;
      return err;
    });
  }

  url = (url.search(/^https?:\/\//i) < 0) ?
    url.replace(/^[^:]+:/i, "http:") :
    url;

  function poller() {
    request(url, '', Rx)
      .then(function() {
        timer = setTimeout(poller, 1000);
      })
      .catch(function() {
        if (rc > 5) {
          clearTimeout(timer);
          console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
        } else {
          console.error("Reconnecting attempt " + rc);
          timer = setTimeout(poller, 1000);
        }
      });
  }

  request(url + '?nopoll=true', '', Rx)
    .then(poller, poller);

  function Post(d) {
    request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
  }
  return Post;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(url, Rx) {
  var ct,
    rt,
    rc = 0,
    ec = 0;

  function connect() {
    return new Promise(function(resolve, reject) {
      function ConnectionTimeout() {
        socket.close();
        reject(new Error("WS: Connection attempt failure"));
      }

      var socket = new WebSocket(url);
      ct = setTimeout(ConnectionTimeout, 9000);
      console.log("WS:New connection to " + url);
      socket.onclose = function(e) {
        console.log("WS:Connection to " + url + " closed.");
      };
      socket.onopen = function(e) {
        clearTimeout(ct);
        rc = 0;
        if (e.data) {
          Rx(e.data);
        }
        resolve(socket);
      };
      socket.onerror = function(error) {
        console.error(error);
        ec++;
        if (ec > 5) {
          socket.close();
          console.log("WS:Too many errors. Reconnecting");
          reject(error);
          ec = 0;
        }
      };
      socket.onmessage = function(e) {
        Rx(e.data);
      };
    });
  }

  function createConnection() {
    return connect()
      .catch(function(err) {
        return new Promise(function(resolve, reject) {
          if (rc > 5) reject(new Error("WS:Socket connection lost. Reconnection constantly failing. Try reloading page."));
          else {
            console.error(err);
            rc++;
            rt = setInterval(resolve, 10000);
          }
        })
          .then(createConnection)
          .catch(console.error);
      });
  }

  var connection = createConnection();

  return function(d) {
    connection.then(function(socket) {
      socket.send(
        (typeof d !== "string") ?
          JSON.stringify(d) :
          d
      );
    });
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var elementfactory = __webpack_require__(1).element;

function getElements(id,el){
  var r=[];
  if (!el.length) el=[el];
  for (var i=0;i<el.length;i++){
    var e=el[i].querySelectorAll("#"+id);
    if (e.length==0){
      (e=[]).push(el[i].appendChild(elementfactory("div#"+id)));
    }
    for (var j=0;j<e.length;j++){
      r.push(e[j]);
    }
  }
  return r;
}

module.exports = function SeamlessSync(data){
  
  var key;
  for (key in data){
    if ((key == "_id") || (typeof data[key] === "boolean")) {
      this.setAttribute(key,data[key]);
    }
    else {
      switch(typeof data[key]){
        case "number":
        case "string":
          getElements(key,this).forEach(function(e){
            if (/input/i.test(e.tagName)) {
              e.value = data[key];
              if (!e.onchange) {
                e.onchange=function(evt){
                  clearTimeout(this.timeout);
                  this.timeout = setTimeout(function(){
                    data[this.id] = this.value;
                    this.dispatchEvent(
                      new CustomEvent(
                        'seamlessdatachange',{bubbles:true}
                      )
                    );
                  }.bind(this),1000);
                };
              }
            }
            else e.innerText = data[key];
          });
          break;
        case "object":
          getElements(key,this).forEach(function(e){
            SeamlessSync.apply(e,data[key]);
          })
      }
    }
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*  global localStorage, CustomEvent  */



module.exports = function(){
  
  function storageAvailable(type) {
  	try {
  		var storage = window[type],
  			x = '__storage_test__';
  		storage.setItem(x, x);
  		storage.removeItem(x);
  		return true;
  	}
  	catch(e) {
  		return false;
  	}
  }
  
  if (storageAvailable('localStorage')){
    return window.localStorage;
  }
  else{
    return Object.defineProperties(new Object(),{
      'setItem': {
        value: function(k,v){
          var e = new CustomEvent('storage',{detail:{
            key:k,
            oldValue:this[k],
            newValue:v,
            storageArea:this
          }});
          this[k] = v;
          (window || self).dispatchEvent(e);
          return v;
        } 
      },
      'getItem': {
        value: function(k){
          return this[k] || null;
        }
      },
      'removeItem': {
        value: function(k){
          delete this[k];
          return this;
        }
      },
      'key': {
        value: function(n){
          var i,c=0;
          for (i in this){
            if (c==n) return this[i];
            c++;
          }
        }
      },
      'clear': {
        value: function(){
          var i;
          for (i in this){
            this.removeItem(i);
          }
          return this;
        }
      },
      'length': {
        get: function(){
          var i,c=0;
          for (i in this){
            c++;
          }
          return c;
        }
      }
    });
  }
  
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);