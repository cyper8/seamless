module.exports = function(url,callback){
  var connect = require("./ajax.js");
  var timer,rc=0,
  poller;
  (
    function createConnection(success){
      timer = setInterval(function(){
        try {
          poller = connect(url,'',Result);
        }
        catch(err) {
          console.error(err);
          rc++;
          if (rc>5){
            clearTimeout(timer);
            rc=0;
            poller = null;
            if (window){
              alert("Connection lost. Reconnection constantly failing. Try reloading page.");
            }
            else{
              success(false);
            }
          }
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