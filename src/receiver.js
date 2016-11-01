var md5 = require("./md5.js").md5;

module.exports = function(url){
  
  return new Promise(
    function(success,error){
      var storage = require("./storage.js");
      
      function processResponse(r){
        var data = JSON.stringify(r.data);
        var hash = md5(url+data);
        if (storage.getItem(hash) == null){
          storage.clear();
          success({
            data: storage.setItem(hash,data),
            post: r.post
          });
        }
      }
      
      var connection = (WebSocket?
        require("./socket.js")(url):
        require("./poller.js")(url))
          .then(function (res){
            processResponse(res);
          })
          .catch(error);
      
    }
  );
}