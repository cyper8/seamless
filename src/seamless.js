/* global URL, Blob, Worker */
//var getWorkerCode = require("worker.js");

module.exports = function Seamless(endpoint){
  if (window.Worker) {
    var worker;
    return new Promise(
      function(success,error){
        worker = new Worker(
          URL.createObjectURL(
            new Blob(require("./worker.js").code(endpoint))
          )
        );
        worker.onerror = function(e){
          worker.terminate();
          error(e);
        };
        worker.onmessage = function(e){
          success({
            data: e.data,
            post: worker.postMessage
          });
        };
      }
    );
  }
  else {
    return require("./receiver.js")(endpoint);
  }
}
