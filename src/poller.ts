export function poller(url: string, Rx: Function): Function {
  var timer,
    rc = 0;

  function request(url, data, Receiver): Promise<any> {
    return new Promise(function(resolve, reject):void {
      var verb: string = (!data || data == '') ? 'GET' : 'POST';
      var xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            this.abort();
            reject(this.status + ': Request Error');
          }
        }
      });
      xhr.addEventListener("error", function(e) {
        this.abort();
        reject(e);
      });
      xhr.timeout = 30000;
      xhr.addEventListener("timeout", function() {
        if ((this.readyState > 0) && (this.readyState < 4))
          this.abort();
        reject(new Error("Request timed out!"));
      });
      xhr.responseType = 'json';
      xhr.open(verb, encodeURI(url), true);
      xhr.setRequestHeader('Accept', 'application/json');
      if (verb == 'POST') xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data || '');
    }).then(function(res):void {
      if (res) Receiver(res);
    }).catch(function(err) {
      console.error(err);
      Receiver(false);
      rc++;
      return err;
    });
  }

  url = (url.search(/^https?:\/\//i) < 0) ?
    url.replace(/^[^:]+:/i, "http:") :
    url;

  function poll():void {
    request(url, '', Rx)
      .then(function() {
        timer = setTimeout(poll, 1000);
      })
      .catch(function() {
        if (rc > 5) {
          clearTimeout(timer);
          console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
        } else {
          console.error("Reconnecting attempt " + rc);
          timer = setTimeout(poll, 1000);
        }
      });
  }

  request(url + '?nopoll=true', '', Rx)
    .then(poll, poll);

  function Post(d) {
    request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
  }
  return Post;
}
