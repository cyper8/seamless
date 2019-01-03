import { AbortableFetch } from './fetch.js';
import { ajax } from './ajax.js';
export class Poller {
    constructor(url, receiver) {
        this.__reconnectCount = 0;
        this.__url = (url.search(/^https?:\/\//i) < 0) ?
            url.replace(/^[^:]+:/i, "http:") :
            url;
        this.__receiver = receiver;
        this.__init()
            .then(() => this.__poll());
    }
    __request(url, data) {
        console.log(url);
        let request;
        let options = {
            method: (!data || data == '') ? 'GET' : 'POST',
            headers: {
                "Accept": "application/json"
            },
        };
        if (options.method === 'POST') {
            options.body = data;
            options.headers["Content-Type"] = 'application/json';
        }
        if (fetch && AbortController) {
            request = AbortableFetch(url, options);
        }
        else {
            request = ajax(url, options);
        }
        this.request = request;
        return request.request
            .then((response) => {
            this.__receiver(response);
        });
    }
    __Post(d) {
        return this.__request(this.__url, (typeof d !== "string") ? JSON.stringify(d) : d);
    }
    __init() {
        let resolver;
        let rejector;
        console.log('initializing');
        this.transmitter = new Promise((resolve, reject) => {
            [resolver, rejector] = [resolve, reject];
        });
        return this.__request(this.__url + '?nopoll=true', '')
            .then(() => {
            resolver(this.__Post.bind(this));
            console.log('initialized');
        }, (err) => {
            console.error(`Connection Initialization failed:`, err);
            rejector(err);
        });
    }
    __poll() {
        console.log('polling');
        return this.__request(this.__url, '')
            .then(() => {
            this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
        })
            .catch((err) => {
            console.error(`Connection polling failure: `, err);
            if (this.__reconnectCount > 5) {
                window.clearTimeout(this.__timer);
                this.__reconnectCount = 0;
                console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
                this.transmitter = Promise.reject(err);
            }
            else {
                console.error("Reconnecting attempt " + this.__reconnectCount++);
                this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
            }
        });
    }
    close() {
        this.request.abort();
    }
}
// export function poller(url:URLString, receiver:Function): Promise<Function> {
//
//   let timer: number;
//   let rc: number = 0;
//
//   function request(url: URLString, data: BodyInit): Promise<Object> {
//     console.log(url);
//     let options = {
//       method: (!data || data == '') ? 'GET' : 'POST',
//       headers: {
//         "Accept": "application/json"
//       }
//     };
//
//     if (options.method === 'POST') {
//       options["body"] = data;
//       options.headers["Content-Type"] = 'application/json';
//     }
//
//     if (fetch && AbortController) {
//       let abortController = new AbortController();
//       let abortSignal = abortController.signal;
//       options["signal"] = abortSignal;
//       return Promise.race([
//         fetch(<string>url, options).then((res)=>{
//           if (res.status === 200) {
//             return res.json();
//           }
//           else {
//             throw new Error(res.status.toString());
//           }
//         }),
//         new Promise((_, reject)=>setTimeout(()=>{
//           abortController.abort();
//           reject('Fetch timeout reached. Request aborted.');
//         }, 30000)),
//       ]);
//     }
//     else {
//       return (new Promise(function(resolve):void {
//         var xhr: XMLHttpRequest = new XMLHttpRequest();
//         const Abort = function(reason){
//           console.error(reason);
//           if ((this.readyState > 0) && (this.readyState < 4)) {
//             this.abort();
//           }
//         }.bind(xhr);
//         xhr.timeout = 30000;
//         xhr.addEventListener('readystatechange', function() {
//           if (this.readyState == 4) {
//             if (this.status == 200) {
//               resolve(this.response);
//             }
//           }
//         });
//         xhr.addEventListener("error", Abort);
//         xhr.addEventListener("timeout", Abort);
//         xhr.responseType = 'json';
//         xhr.open(options.method, <string>url, true);
//         for (let h in options.headers) {
//           xhr.setRequestHeader(h, options.headers[h]);
//         }
//         xhr.send(data || '');
//       }));
//     }
//   }
//
//   function init() {
//     return request(url + '?nopoll=true', '')
//     .then((response)=>{
//       console.log('initialized');
//       receiver(response);
//     });
//   }
//
//   function Post(d: BodyInit):Promise<any> {
//     return request(url, (typeof d !== "string") ? JSON.stringify(d) : d)
//     .then((response)=>receiver(response));
//   }
//
//   function poll():Promise<any> {
//     console.log('polling');
//     return request(url, '')
//       .then(function(response) {
//         receiver(response);
//         timer = window.setTimeout(poll, 1000);
//       });
//   }
//
//   return new Promise((resolve,reject)=>{
//     url = (url.search(/^https?:\/\//i) < 0) ?
//     url.replace(/^[^:]+:/i, "http:") :
//     url;
//
//     init()
//     .then(()=>{
//       resolve(Post);
//     })
//     .then(poll)
//     .catch(function(err) {
//       console.error(err);
//       if (rc > 5) {
//         window.clearTimeout(timer);
//         rc = 0;
//         console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
//         reject(err);
//       } else {
//         console.error("Reconnecting attempt " + rc);
//         timer = window.setTimeout(poll, 1000);
//       }
//     });
//   });
// }
//# sourceMappingURL=poller.js.map