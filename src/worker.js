
function workerFunction(url){
  var sendToServer;
  onmessage = function(e){
    if (sendToServer){
      sendToServer(e.data || e);
    }
    else{
      postMessage(null);
    }
  };
  var receiver = require("./receiver.js")(url)
    .then(function(res){
      sendToServer = res.post;
      postMessage(res.data);
    })
    .catch(function(err){
      throw new Error(err);
    });
};

module.exports = workerFunction;

module.exports.code = function(url){
  return "(" + (workerFunction.toSource || workerFunction.toString)() + ")("+url+")";
};
