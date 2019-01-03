import { Socket } from './socket.js';
import { Poller } from './poller.js';
export class Channel {
    get egress() {
        return this.__backend.transmitter;
    }
    close() {
        this.__backend.close();
    }
    constructor(url, ingress) {
        if (((url.search(/^wss?:\/\//i) >= 0)) && WebSocket) {
            this.__backend = new Socket(url, ingress);
        }
        else {
            this.__backend = new Poller(url.replace(/^ws/, "http"), ingress);
        }
    }
}
//# sourceMappingURL=channel.js.map