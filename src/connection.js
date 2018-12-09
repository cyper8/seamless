import { Buffer } from './buffer.js';
import { ComplementUrl } from './utils/complement-url.js';
import { socket } from './socket.js';
import { poller } from './poller.js';
import { SeamlessClient } from './client.js';
export function Connection(url) {
    var self = this;
    function ToDOM(data) {
        self.clients.forEach(function (e) {
            if (e.seamless)
                e.seamless(data);
            else
                e.status = data;
        });
    }
    function Receiver(response) {
        let data = response.data || response;
        self.buffer.write(data).then((data) => ToDOM(data));
    }
    function Connect(receiver) {
        if (((self.url.search(/^wss?:\/\//i) >= 0)) && WebSocket) {
            return socket(url, receiver);
        }
        else {
            return poller(url.replace(/^ws/, "http"), receiver);
        }
    }
    function Transmit(data) {
        return Promise.all([
            Transmitter,
            self.buffer.write(data)
        ]).then(([transmitter, data]) => {
            return transmitter(data);
        });
    }
    this.url = ComplementUrl(url);
    this.buffer = new Buffer(this.url);
    this.clients = [];
    this.then = (callback) => Transmitter.then(() => callback(this));
    this.bindClients = function (elements) {
        this.clients = elements.map((element) => new SeamlessClient(element, Transmit, self.buffer.data));
        return self;
    };
    this.unbindClients = function (elements) {
        let elems = elements || self.clients;
        elems.forEach((e) => {
            let index = self.clients.indexOf(e);
            if (index >= 0) {
                let el = self.clients.splice(index, 1)[0];
                if (el.deseamless)
                    el.deseamless();
            }
        });
        return self;
    };
    const Transmitter = Connect(Receiver);
}
//# sourceMappingURL=connection.js.map