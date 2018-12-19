var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function poller(url, receiver) {
    let timer;
    let rc = 0;
    function request(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let endpoint = encodeURI(url);
            console.log(endpoint);
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
            if (fetch && AbortController) {
                let abortController = new AbortController();
                let abortSignal = abortController.signal;
                options["signal"] = abortSignal;
                let abortableFetch = Promise.race([
                    fetch(endpoint, options).then((res) => {
                        if (res.status === 200) {
                            return res.json();
                        }
                        else {
                            throw new Error(res.status.toString());
                        }
                    }),
                    new Promise((_, reject) => setTimeout(() => {
                        abortController.abort();
                        reject('Fetch timeout reached. Request aborted.');
                    }, 30000)),
                ]);
                response = yield abortableFetch;
            }
            else {
                response = yield (new Promise(function (resolve) {
                    var xhr = new XMLHttpRequest();
                    const Abort = function (reason) {
                        console.error(reason);
                        if ((this.readyState > 0) && (this.readyState < 4)) {
                            this.abort();
                        }
                    }.bind(xhr);
                    xhr.timeout = 30000;
                    xhr.addEventListener('readystatechange', function () {
                        if (this.readyState == 4) {
                            if (this.status == 200) {
                                resolve(this.response);
                            }
                        }
                    });
                    xhr.addEventListener("error", Abort);
                    xhr.addEventListener("timeout", Abort);
                    xhr.responseType = 'json';
                    xhr.open(options.method, endpoint, true);
                    for (let h in options.headers) {
                        xhr.setRequestHeader(h, options.headers[h]);
                    }
                    xhr.send(data || '');
                }));
            }
            return response;
        });
    }
    function init() {
        return request(url + '?nopoll=true', '')
            .then((response) => {
            console.log('initialized');
            receiver(response);
        });
    }
    function Post(d) {
        return request(url, (typeof d !== "string") ? JSON.stringify(d) : d)
            .then((response) => receiver(response));
    }
    function poll() {
        console.log('polling');
        return request(url, '')
            .then(function (response) {
            receiver(response);
            timer = window.setTimeout(poll, 1000);
        });
    }
    return new Promise((resolve, reject) => {
        url = (url.search(/^https?:\/\//i) < 0) ?
            url.replace(/^[^:]+:/i, "http:") :
            url;
        init()
            .then(() => {
            resolve(Post);
        })
            .then(poll)
            .catch(function (err) {
            console.error(err);
            if (rc > 5) {
                window.clearTimeout(timer);
                rc = 0;
                console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
                reject(err);
            }
            else {
                console.error("Reconnecting attempt " + rc);
                timer = window.setTimeout(poll, 1000);
            }
        });
    });
}
//# sourceMappingURL=poller.js.map