import { URLString } from './utils/complement-url.js';
import { AbortableRequest } from './poller';

export function ajax(url: URLString, options: RequestInit): AbortableRequest<Object> {
  let data = options.body;
  let xhr: XMLHttpRequest;
  return {
    request: (new Promise(function(resolve):void {
      xhr = new XMLHttpRequest();
      const Abort = function(reason){
        console.error(reason);
        if ((this.readyState > 0) && (this.readyState < 4)) {
          this.abort();
        }
      }.bind(xhr);
      xhr.timeout = 30000;
      xhr.addEventListener('readystatechange', function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(<Object>this.response);
          }
        }
      });
      xhr.addEventListener("error", Abort);
      xhr.addEventListener("timeout", Abort);
      xhr.responseType = 'json';
      xhr.open(options.method, <string>url, true);
      for (let h in options.headers) {
        xhr.setRequestHeader(h, options.headers[h]);
      }
      xhr.send(data || '');
    })),
    abort() {
      xhr.abort();
    }
  }
}
