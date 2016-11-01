module.exports = function(url){
  var connect = require("./ajax.js");
  var timer,
  poller;
  return new Promise(
    function(success, error){
      timer = setInterval(function(){
        poller = connect(url,'')
          .then(Result)
          .catch(function(err){
            clearInterval(timer);
            error(err);
          });
      }, 3000);
      function Result(responce){
        return success({
          data: responce,
          post: Post
        });
      }
      function Post(d){
        return connect(url,d)
          .then(Result, error);
      }
    }
  );
};