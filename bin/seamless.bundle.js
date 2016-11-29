/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global URL, Blob, Worker */
	//var getWorkerCode = require("worker.js");
	var storage = __webpack_require__(1)(),
	    md5 = __webpack_require__(2)(),
	    sync = __webpack_require__(3);
	
	Window.Seamless={
	  compile: function(dom){
	    var seamlessElements = dom.querySelectorAll("*[data-seamless]");
	    for (var i=0;i<seamlessElements.length;i++){
	      var el=seamlessElements[i];
	      this.connect(el.dataset.seamless).bindClients(el);
	    }
	  },
	  connection: function(url){
	    return this.connections[md5(url)] || false;
	  },
	  connect: function(url){ // connection object closure
	    var rh = md5(url),
	      dh,
	      Transmit,
	      connection,
	      buffer,
	      InitConnection;
	
	    function handle(data,to){
	      var d,odh=storage.getItem(rh);
	      if (typeof data !== "string"){
	        try {
	          d=JSON.stringify(data);
	        }
	        catch(err){
	          throw err;
	        }
	      }
	      else {
	        try{
	          d=data;
	          data=JSON.parse(d);
	        }
	        catch(err){
	          throw err;
	        }
	      }
	      if (!buffer){
	        buffer=data;
	      }
	      var dh=md5(d);
	      if (odh !== dh){
	        buffer=data;
	        storage.removeItem(odh);
	        storage.setItem(dh,d);
	        storage.setItem(rh,dh);
	        to(buffer);
	      }
	    }
	
	    function ToDOM(data){
	      connection.clients.forEach(function(e,i,a){
	        if (e.seamless) e.seamless(data);
	      });
	    }
	
	    if (!(connection=this.connection(url))){
	      if (dh=storage.getItem(rh)){
	        var b;
	        if (b=storage.getItem(dh)){
	          try{
	            buffer=JSON.parse(b);
	          }
	          catch(err){
	            throw err;
	          }
	        }
	      }
	      InitConnection=new Promise(function(success,error){
	        var transmitter;
	        
	        if (Worker){
	          var worker = new Worker(
	            URL.createObjectURL(
	              new Blob(__webpack_require__(4).code(url))
	            )
	          );
	          worker.onerror = function(e){
	            worker.terminate();
	            console.error(e);
	          };
	          worker.onmessage = function(e){
	            if (e.data != "false") {
	              handle(e.data,success);
	            }
	            else {
	              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
	            }
	          };
	          transmitter = function(msg){
	            worker.postMessage(msg);
	          };
	        }
	        else {
	          transmitter = (function(callback){
	            if (!(url.search(/^wss?:\/\//i)<0) && WebSocket){
	              return __webpack_require__(5)(url,callback);
	            }
	            else{
	              return __webpack_require__(6)(url,callback);
	            }
	          })(function(args){
	            if (args && args != "false"){
	              handle(args,success);
	            }
	            else {
	              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
	            }
	          });
	        }
	
	        Transmit=function (data){
	          handle(data,transmitter);
	        };
	      })
	      .then(ToDOM)
	      .catch(function(err){
	        throw err;
	      });
	      connection={
	        url: url,
	        hashes:{
	          url: rh,
	          get data(){
	            return storage.getItem(connection.hashes.url);
	          }
	        },
	        get data(){
	          return buffer;
	        },
	        clients: [],
	        bindClients: function(elems){
	          if (!(elems instanceof Array)) elems=[elems];
	          connection.clients.concat(elems);
	          elems.forEach(function(e,i,a){
	            var e = e;
	            if (buffer){
	              sync(buffer,e,Transmit);
	            }
	            else{
	              e.connecting=InitConnection.then(function(){
	                sync(buffer,e,Transmit);
	                delete e.connecting;
	              })
	              .catch(function(err){throw err});
	            }
	          });
	        },
	        unbindClients: function(elems){
	          if (!elems) elems=connection.clients;
	          if (!(elems instanceof Array)) elems=[elems];
	          elems.forEach(function(e,i,a){
	            var index=connection.clients.indexOf(e);
	            if (index >= 0) {
	              var e = connection.clients.splice(index,1);
	              if (e.deseamless) e.deseamless();
	              else {
	                e.connecting.then(function(element){
	                  element.deseamless();
	                })
	                .catch(function(err){
	                  throw err;
	                });
	              }
	            }
	          });
	        }
	      };
	      this.connections[rh]=connection;
	    }
	    return connection;
	  },
	  disconnect: function(url){
	    this.connection(url).unbindClients();
	    delete this.connection(url);
	  },
	  connections: {},
	};
	
	
	window.addEventListener("load",function(){
	  Window.Seamless.compile(document.body);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	function element(desc){
	    var type = desc||"".match(/^[a-z][a-z0-9]*/i)[0];
	    var classes = desc.match(/\.([a-z][a-z0-9]*)/ig) || [];
	    var id = desc.match(/\#([a-z][a-z0-9]*)/i) || [];
	    if (type=="") return null;
	    var element = document.createElement(type[0]);
	    element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
	    element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
	    return element;
	}
	
	module.exports = function seamlessSync(data,root,send){
	  var incoming={},base={};
	
	  if (typeof data !== "object"){
	    throw new TypeError("Wrong argument data type!");
	  }
	
	  function CastChanges(evt){
	    evt.stopPropagation();
	    send(evt.detail);
	  }
	
	  root.addEventListener("seamlessdatachange",CastChanges);
	
	  function getEls(el,id){
	    var r=[];
	    if (!el.length) el=[el];
	    for (i in el){
	      var e=el[i].querySelectorAll("#"+id);
	      if (e.length==0){
	        e.push(el[i].appendChild(element("div#"+id)));
	      }
	      for (j in e){
	        r.push(e[j]);
	      }
	    }
	    return r;
	  }
	
	  function createKey(k,d,i,b,e){
	    switch(typeof d[k]){
	      case "number":
	      case "string":
	        var is=function(a){
	          if (b[k] != a){
	            b[k]=a;
	            e.forEach(function(e,idx,ar){
	              if (/input/i.test(e.tagName)) e.value=a;
	              else e.innerText=a;
	            });
	          }
	        }
	        var os=function(a){
	          if (d[k] != a){
	            d[k]=a;
	            e.forEach(function(e,idx,ar){
	              if (/input/i.test(e.tagName)) e.value=a;
	              else e.innerText=a;
	            });
	            var evt=new CustomEvent("seamlessdatachange",{bubbles:true,detail:data});
	            root.dispatchEvent(evt);
	          }
	        }
	        var ig=function(){
	          return b;
	        }
	        Object.defineProperty(i,k,{
	          get: ig,
	          set: is,
	          enumerable: true
	        });
	        // id[k]=v;
	        e.forEach(function(e,idx,ar){
	          if (/input/i.test(e.tagName)){
	            function LocalChange(e){
	              if (e.target == this){
	                os(this.value);
	              }
	            }
	            e.addEventListener("change",LocalChange);
	            e.removeSeamlessCallback=function(){
	              e.removeEventListener("change",LocalChange);
	            };
	          }
	        });
	        break;
	      case "object":
	        i[k]={};
	        for (n in d[k]){
	          createKey(n,d[k],i[k],b[k],getEls(e,n));
	        }
	        break;
	      default:
	    }
	  }
	
	  function syncD(k,d,i,b,e){
	    if (!i[k]){
	      createKey(k,d,i,b,e);
	    }
	    switch(typeof d[k]){
	      case "number":
	      case "string":
	        i[k]=d[k];
	        break;
	      case "object":
	        for (n in d[k]){
	          syncD(n,d[k],i[n],b[n],getEls(e,n));
	        }
	        break;
	      default:
	    }
	  }
	
	  function sync(d){
	    for (k in d){
	      syncD(k,d,incoming,base,getEls(root,k));
	    }
	  }
	  sync(data);
	
	  root.seamless = sync;
	  root.deseamless = function(){
	    (function DeSeamlessChild(c){
	      if (c.value){
	        c.removeSeamlessCallback();
	        delete c.removeSeamlessCallback;
	      }
	      for (i in c){
	        DeSeamlessChild(c[i]);
	      }
	    })(root);
	    root.removeEventListener("seamlessdatachange",CastChanges);
	    delete root.seamless;
	    incoming = {};
	    delete root.deseamless;
	  };
	
	  return root;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	
	function workerFunction(url){
	  var sendToServer;
	  onmessage = function(e){
	    if (sendToServer){
	      sendToServer(e.data || e);
	    }
	    else{
	      postMessage("");
	    }
	  };
	  function respHandler(res){
	    if (res){
	      postMessage(res);
	    }
	    else {postMessage("false")};
	  }
	  if (((/^wss?:\/\//i).test(url)) && WebSocket){
	    sendToServer = __webpack_require__(5)(url,respHandler);
	  }
	  else{
	    sendToServer = __webpack_require__(6)(url,respHandler);
	  }
	};
	
	module.exports.code = function(url){
	  var code = workerFunction.toString();
	  var re = /([a-zA-Z_]*require[_]*)\(([^()]*)\)[^({ ;]*/m;
	  var m;
	  while((m = re.exec(code)) !== null){
	    if (m.index === re.lastIndex) re.lastIndex++;
	
	    var p = code.split(m[0]);
	    var i = eval(m[0]+".toString()");
	    code = p.join("("+i+")");
	  }
	  return ["(" + code + ")(\""+url+"\")"];
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(url,Rx){
	  var socket,ct,rt,rc=0,ec=0;
	  (function createConnection(success){
	    socket = new WebSocket(url);
	    ct=setTimeout(socket.close,9000);
	    console.log("New connection to "+url);
	    socket.onclose = function(e){
	      console.log("Connection to "+url+" closed.");
	    };
	    socket.onopen = function(e){
	      clearTimeout(ct);
	      rc=0;
	      if (e.data) {
	        Response(e.data);
	      }
	    };
	    socket.onerror = function(err){
	      console.error(err);
	      ec++;
	      if (ec>10) {
	        socket.close();
	        console.log("Too many errors. Reconnecting");
	        ec=0;
	      }
	    };
	    socket.onmessage = function(e){
	      Response(e.data);
	    };
	    function Response(res){
	      success(res);
	    }
	    if (!rt){// WATCHDOG
	      rt=setInterval(
	        function(){
	          if (socket){
	            if (socket.readyState == 3){ // CLOSED
	              createConnection(success);
	              rc++;
	            }
	          }
	          if (rc>5){
	            clearInterval(rt);
	            alert("Connection lost. Reconnection constantly failing. Try reloading page.") ||
	            success(false);
	          }
	        }, 10000);
	    }
	    return function(d){
	      socket.send(
	        (typeof d !== "string")?
	        JSON.stringify(d):
	        d
	      )
	    };
	  })(Rx);
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(url,Rx){
	  var timer,rc=0,
	  poller;
	
	  function connect(url,data,Receiver){
	    var verb = (!data||data=='')?'GET':'POST';
	    var xhr = new XMLHttpRequest();
	    xhr.addEventListener("readystatechange", function(e){
	      if (this.readyState == 4){
	        if (this.status == 200){
	          Receiver(this.response);
	        }
	        else {
	          this.abort();
	          throw Error(this.status + ': ' +this.response.toString());
	        }
	      }
	    });
	    xhr.addEventListener("error",function(e){
	      this.abort();
	      throw Error(e.type);
	    });
	    xhr.timeout = 30000;
	    xhr.addEventListener("timeout",function(){
	      if ((this.readyState > 0) && (this.readyState < 4))
	        this.abort();
	      throw Error("Request timed out!");
	    });
	  	xhr.responseType = 'json';
	    (xhr.executesession = function(){
	      xhr.open(verb,encodeURI(url),true);
	      xhr.send(data | '');
	    })();
	  };
	
	  url = (url.search(/^https?:\/\//i)<0)?
	          url.replace(/^[^:]+:/i,"http:"):
	          url;
	
	  (
	    function createConnection(Receiver){
	      timer = setInterval(function(){
	        try {
	          poller = connect(url,'',Receiver);
	        }
	        catch(err) {
	          console.error(err);
	          rc++;
	          if (rc>5){
	            clearTimeout(timer);
	            rc=0;
	            poller = null;
	            alert("Connection lost. Reconnection constantly failing. Try reloading page.") ||
	            Receiver(false);
	          }
	        }
	      }, 3000);
	      function Post(d){
	        connect(url,(typeof d !== "string")?JSON.stringify(d):d,Receiver);
	      }
	      return Post;
	    }
	  )(Rx);
	};


/***/ }
/******/ ]);
//# sourceMappingURL=seamless.bundle.js.map