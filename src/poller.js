var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function poller(url, Rx) {
    return __awaiter(this, void 0, void 0, function* () {
        var timer, rc = 0;
        function request(url, data, Receiver) {
            return __awaiter(this, void 0, void 0, function* () {
                let response;
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
                    response = yield fetch(endpoint, options);
                }
                else {
                    response = yield new Promise(function (resolve) {
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener('readystatechange', function () {
                            if (this.readyState == 4) {
                                if (this.status == 200) {
                                    resolve(this.response);
                                }
                                else {
                                    this.abort();
                                    throw new Error(this.status + ': Request Error');
                                }
                            }
                        });
                        xhr.addEventListener("error", function (e) {
                            this.abort();
                            throw e;
                        });
                        xhr.timeout = 30000;
                        xhr.addEventListener("timeout", function () {
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
                    });
                }
                Receiver(response);
                return response;
            });
        }
        url = (url.search(/^https?:\/\//i) < 0) ?
            url.replace(/^[^:]+:/i, "http:") :
            url;
        function poll() {
            request(url, '', Rx)
                .then(function () {
                timer = setTimeout(poll, 1000);
            })
                .catch(function () {
                if (rc > 5) {
                    clearTimeout(timer);
                    console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
                }
                else {
                    console.error("Reconnecting attempt " + rc);
                    timer = setTimeout(poll, 1000);
                }
            });
        }
        let init_request = yield request(url + '?nopoll=true', '', Rx);
        init_request.then(poll, poll);
        return function Post(d) {
            request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
        };
    });
}
//# sourceMappingURL=poller.js.map