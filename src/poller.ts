export async function poller(url: string, Rx: Function): Promise<Function> {
  let timer: number;
  let rc: number = 0;
  // let ec: number = 0;

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
      let abortController = new AbortController();
      let abortSignal = abortController.signal;
      options["signal"] = abortSignal;
      let abortableFetch = Promise.race([
        fetch(endpoint, options),
        new Promise((_, reject)=>setTimeout(()=>{
          abortController.abort();
          reject('Fetch timeout reached. Request aborted.');
        }, 30000)),
      ]);
      response = await abortableFetch;
    }
    else {
      response = await (new Promise(function(resolve):void {
        var xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.timeout = 30000;
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
          console.error(e);
          this.abort();
          throw e;
        });
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
      }));
    }

    Receiver(response);

    return response;
  }

  function poll():void {
    request(url, '', Rx)
      .then(function() {
        timer = window.setTimeout(poll, 1000);
      })
      .catch(function() {
        if (rc > 5) {
          window.clearTimeout(timer);
          console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
        } else {
          console.error("Reconnecting attempt " + rc);
          timer = window.setTimeout(poll, 1000);
        }
      });
  }

  url = (url.search(/^https?:\/\//i) < 0) ?
    url.replace(/^[^:]+:/i, "http:") :
    url;
  await request(url + '?nopoll=true', '', Rx);
  poll();

  return function Post(d: BodyInit):void {
    request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
  }
}
