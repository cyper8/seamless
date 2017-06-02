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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = exports = function SeamlessMongoosePlugin (schema){
  var buffer={},ts={},clients={};
  var BUFFER_TTL=21000;
  
  SeamlessMongoosePlugin._garbageCollector = setInterval(function(){
    var i,c=0;
    for (i in ts){
      if ((Date.now() - ts[i]) > BUFFER_TTL) {
        delete buffer[i];
        delete ts[i];
      }
      else c++;
    }
    BUFFER_TTL = (-3*c)+21000;
  },BUFFER_TTL);
  
  function documentChanged(doc){
    var id=doc._id,sdoc = JSON.stringify(doc);
    
    buffer[id] = sdoc;
    
    if (clients[id] && clients[id].length) {
      clients[id].forEach(function(e,i,a){
        ts[id] = Date.now();
        e.send(sdoc);
      });
    }
  }
  
  SeamlessMongoosePlugin.registerClient = function(id,peer){
    clients[id] = (clients[id].length) ? clients[id].concat([peer]) : [peer];
    schema.statics.seamlessGetData(id,peer);
  };
  
  SeamlessMongoosePlugin.deregisterClient = function(id,peer){
    if (clients[id] && clients[id].length){
      var pos = clients[id].indexOf(peer);
      if (pos >= 0){
        clients[id].splice(pos,1);
        if (!clients[id].length) {
          delete clients[id];
        }
      }
    }
  };
  
  schema.statics.seamlessGetData = function(id,peer){
    ts[id] = Date.now();
    if (buffer[id]) {
      peer.send(buffer[id]);
    }
    else {
      this.findOne({_id:id}).exec(function(err,doc){
        if (err) {
          peer.status(500).send('Error querying '+id+': '+err.toString());
          return;
        }
        var sdoc = JSON.stringify(doc);
        peer.send(buffer[id] = sdoc);
      });
    }
  };
  
  schema.statics.seamlessSetData = function(id,data,peer){
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      }
      catch(err){
        peer.status(400).send('Not a valid JSON: '+err.toString());
        return;
      }
    }
    this.findOne({_id:id}).exec(function(err,doc){
      if (err) {
        peer.status(500).send('Error querying '+id+': '+err.toString());
        return;
      }
      
      if (doc){ // query returned a document
        var k;
        for (k in data){
          if (k == "_id") continue;
          else {
            doc[k] = data[k];
          }
        }
        
        doc.save(function(err){
          if (err) {
            peer.status(500).send('Error saving '+id+': '+err.toString());
            return;
          }
          var sdoc = JSON.stringify(doc);
          peer.send(sdoc);
          documentChanged(doc);
        });
      }
      else { // no document found - need to create one
        data._id = id;
        this.create(data,function(err,doc){
          if (err) {
            peer.status(500).send('Error saving '+id+': '+err.toString());
            return;
          }
          
          var sdoc = JSON.stringify(doc);
          peer.send(sdoc);
          documentChanged(doc);
        })
      }
      
    });
  }
  
}

/***/ })
/******/ ]);