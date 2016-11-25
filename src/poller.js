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
