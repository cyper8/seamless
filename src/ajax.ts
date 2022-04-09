import { URLString } from "./utils/complement-url.js";
import { AbortableRequest } from "./poller.js";

export function ajax(
  url: URLString,
  options: RequestInit
): AbortableRequest<Object> {
  let data = options.body as XMLHttpRequestBodyInit;
  let xhr: XMLHttpRequest;
  return {
    request: new Promise(function (resolve, reject): void {
      xhr = new XMLHttpRequest();
      const Abort = function () {
        reject(new DOMException("Request cancelled", "AbortError"));
      }.bind(xhr);
      const Expire = function () {
        reject(new Error("Connection timeout reached"));
        if (this.readyState > 0 && this.readyState < 4) {
          this.abort();
        }
      }.bind(xhr);
      const Report = function (error) {
        reject(error);
        if (this.readyState > 0 && this.readyState < 4) {
          this.abort();
        }
      }.bind(xhr);
      xhr.timeout = 30000;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(<Object>this.response);
          }
        }
      });
      xhr.addEventListener("error", Report);
      xhr.addEventListener("timeout", Expire);
      xhr.addEventListener("abort", Abort);
      xhr.responseType = "json";
      xhr.open(options.method, <string>url, true);
      for (let h in options.headers) {
        xhr.setRequestHeader(h, options.headers[h]);
      }
      xhr.send(data || "");
    }),
    abort() {
      xhr.abort();
    },
  };
}
