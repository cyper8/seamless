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
//# sourceMappingURL=poller.js.map