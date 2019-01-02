import { md5 } from './md5.js';
import { ComplementUrl } from './utils/complement-url.js';
import { Connection } from './connection.js';
const MD5 = md5();
export const Seamless = {
    connections: new Map(),
    compile(root) {
        let clients = root.querySelectorAll('*[data-seamless]');
        let new_connections = [];
        for (let i = 0; i < clients.length; i++) {
            let clientNode = clients[i];
            new_connections.push(Seamless.connect(clientNode.dataset.seamless)
                .bindClients([clientNode])
                .established);
        }
        return Promise.all(new_connections);
    },
    getConnection(endpoint) {
        let url = ComplementUrl(endpoint);
        return Seamless.connections.get(MD5(url));
    },
    connect(endpoint) {
        let connection = Seamless.getConnection(endpoint);
        if (!connection) {
            connection = new Connection(endpoint);
            Seamless.connections.set(MD5(connection.url), connection);
        }
        return connection;
    },
    disconnect(endpoint) {
        let connection = Seamless.getConnection(endpoint);
        connection.unbindClients();
        return Seamless.connections.delete(MD5(connection.url));
    }
};
//# sourceMappingURL=seamless.js.map