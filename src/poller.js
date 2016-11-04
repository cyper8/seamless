module.exports = function(url,callback){
  var connect = function (url,data,callback){
    var verb = (!data||data=='')?'GET':'POST';
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function(e){
      if (this.readyState == 4){
        if (this.status == 200){
          callback(JSON.stringify(this.response));
        }
        else {
          console.error(this.status + ': ' +this.response.toString());
        }
      }
    });
    xhr.timeout = 30000;
    xhr.addEventListener("timeout",function(){
      if ((this.readyState > 0) && (this.readyState < 4))
        this.abort();
      console.error('Request timed out');
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
            alert("Connection lost. Reconnection constantly failing. Try reloading page.") ||
            success(false);
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