import { md5 } from './md5';
import { ComplementUrl } from './utils/complement-url';
import { Connection } from './connection';
const MD5 = md5();
export class Seamless {
    constructor() {
        this.connections = new Map();
    }
    compile(root) {
        let clients = root.querySelectorAll('*[data-seamless]');
        let new_connections;
        for (let i = 0; i < clients.length; i++) {
            let clientNode = clients[i];
            new_connections.push(this.connect(clientNode.dataset.seamless)
                .bindClients([clientNode])
                .then((connection) => connection));
        }
        return Promise.all(new_connections);
    }
    getConnection(endpoint) {
        let url = ComplementUrl(endpoint);
        return this.connections.get(MD5(url));
    }
    connect(endpoint) {
        let connection = this.getConnection(endpoint);
        if (!connection) {
            connection = new Connection(endpoint);
            this.connections.set(connection.url, connection);
        }
        return connection;
    }
    disconnect(endpoint) {
        let connection = this.getConnection(endpoint);
        connection.unbindClients();
        return this.connections.delete(connection.url);
    }
}
//# sourceMappingURL=seamless.js.map