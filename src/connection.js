import { Buffer } from './buffer.js';
import { ComplementUrl } from './utils/complement-url.js';
import { Channel } from './channel.js';
import { SeamlessClient } from './client.js';
export class Connection {
    constructor(url) {
        this.clients = [];
        this.to(url);
    }
    __ToDOM(data) {
        this.clients.forEach(function (client) {
            if (client.seamless)
                client.seamless(data);
            else
                client.status = data;
        });
    }
    __receiver(response) {
        this.__buffer.write(response).then((data) => this.__ToDOM(data));
    }
    __transmit(data) {
        return Promise.all([
            this.__transmitter,
            this.__buffer.write(data)
        ]).then(([transmitter, data]) => {
            return transmitter(data);
        });
    }
    get __transmitter() {
        return this.__channel.egress;
    }
    to(url) {
        if (this.__channel) {
            this.close();
        }
        this.url = ComplementUrl(url);
        this.__buffer = new Buffer(this.url);
        this.__channel = new Channel(this.url, this.__receiver.bind(this));
        return this;
    }
    get established() {
        return new Promise((resolve) => {
            this.__transmitter.then(() => {
                resolve(this);
            });
        });
    }
    close() {
        this.__channel.close();
        return this;
    }
    bindClients(elements) {
        this.clients = elements.map((element) => new SeamlessClient(element, this.__transmit.bind(this), this.__buffer.data));
        return this;
    }
    unbindClients(elements) {
        let elems = elements || this.clients;
        elems.forEach((e) => {
            let index = this.clients.indexOf(e);
            if (index >= 0) {
                let el = this.clients.splice(index, 1)[0];
                if (el.deseamless)
                    el.deseamless();
            }
        });
        return this;
    }
}
//# sourceMappingURL=connection.js.map