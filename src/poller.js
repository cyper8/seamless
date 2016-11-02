module.exports = function(url,callback){
  var callback = callback;
  var connect = require("./ajax.js");
  var timer,
  poller;
  (
    function createConnection(success){
      timer = setInterval(function(){
        try {
          poller = connect(url,'',Result)
        }
        catch(err) {
          console.error(err);
        }
      }, 3000);
      function Result(responce){
        return success({
          data: responce,
          post: Post.bind(this),
          connection: {
            disconnect: function(){
              clearInterval(timer);
              poller = null;
            },
            reconnect: function(){
              clearInterval(timer);
              poller = null;
              createConnection(success);
            }
          }
        });
      }
      function Post(d){
        connect(url,d,callback);
      }
    }
  )(callback);
};