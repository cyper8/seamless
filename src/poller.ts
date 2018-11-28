export async function poller(url: string, Rx: Function): Promise<Function> {
  var timer,
    rc = 0;

  async function request(url: string, data: BodyInit, Receiver: Function): Promise<any> {
    let response: any;
    let endpoint = encodeURI(url);
    let options = {
      method: (!data || data == '') ? 'GET' : 'POST',
      headers: {
        "Accept": "application/json"
      }
    };

    if (options.method === 'POST') {
      options["body"] = data;
      options.headers["Content-Type"] = 'application/json';
    }

    if (fetch) {
      response = await fetch(endpoint, options);
    }
    else {
      response = await new Promise(function(resolve):void {
        var xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              resolve(this.response);
            } else {
              this.abort();
              throw new Error(this.status + ': Request Error');
            }
          }
        });
        xhr.addEventListener("error", function(e) {
          this.abort();
          throw e;
        });
        xhr.timeout = 30000;
        xhr.addEventListener("timeout", function() {
          if ((this.readyState > 0) && (this.readyState < 4)) {
            this.abort();
          }
          throw new Error("Request timed out!");
        });
        xhr.responseType = 'json';
        xhr.open(options.method, endpoint, true);
        for (let h in options.headers) {
          xhr.setRequestHeader(h, options.headers[h]);
        }
        xhr.send(data || '');
      })
    }

    Receiver(response);

    return response;
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

  let init_request = await request(url + '?nopoll=true', '', Rx);
  init_request.then(poll, poll);

  return function Post(d: BodyInit):void {
    request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
  }
}
