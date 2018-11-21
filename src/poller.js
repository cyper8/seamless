export function poller(url, Rx) {
    var timer, rc = 0;
    function request(url, data, Receiver) {
        let connect;
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
            connect = fetch(endpoint, options);
        }
        else {
            connect = new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve(this.response);
                        }
                        else {
                            this.abort();
                            reject(this.status + ': Request Error');
                        }
                    }
                });
                xhr.addEventListener("error", function (e) {
                    this.abort();
                    reject(e);
                });
                xhr.timeout = 30000;
                xhr.addEventListener("timeout", function () {
                    if ((this.readyState > 0) && (this.readyState < 4))
                        this.abort();
                    reject(new Error("Request timed out!"));
                });
                xhr.responseType = 'json';
                xhr.open(options.method, endpoint, true);
                for (let h in options.headers) {
                    xhr.setRequestHeader(h, options.headers[h]);
                }
                xhr.send(data || '');
            });
        }
        return connect.then(function (res) {
            if (res)
                Receiver(res);
        }).catch(function (err) {
            console.error(err);
            Receiver(false);
            rc++;
            return err;
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
    request(url + '?nopoll=true', '', Rx)
        .then(poll, poll);
    function Post(d) {
        request(url, (typeof d !== "string") ? JSON.stringify(d) : d, Rx);
    }
    return Post;
}
//# sourceMappingURL=poller.js.map