import { md5 } from './md5.js';
import { ComplementUrl } from './utils/complement-url.js';
import { Connection } from './connection.js';

const MD5 = md5();

declare interface Seamless {
  connections: Map<string, Connection>
  compile(root: HTMLElement): Promise<Connection[]>
  getConnection(endpoint:string): Connection
  connect(endpoint: string): Connection
  disconnect(endpoint: string): Boolean
}

export const Seamless: Seamless = {
  connections: new Map(),

  compile(root) {
    let clients: NodeListOf<HTMLElement> = root.querySelectorAll('*[data-seamless]');
    let new_connections: Array<Promise<Connection>> = [];
    for (let i = 0; i < clients.length; i++) {
      let clientNode: HTMLElement = clients[i];
      new_connections.push(
        Seamless.connect(clientNode.dataset.seamless)
        .bindClients([clientNode])
        .then((connection)=>connection)
      );
    }
    return Promise.all(new_connections);
  },

  getConnection(endpoint) {
    let url:string = ComplementUrl(endpoint);
    return Seamless.connections.get(MD5(url));
  },

  connect(endpoint) {
    let connection = Seamless.getConnection(endpoint);
    if (!connection) {
      connection = new Connection(endpoint);
      Seamless.connections.set(connection.url, connection);
    }
    return connection;
  },

  disconnect(endpoint) {
    let connection = Seamless.getConnection(endpoint);
    connection.unbindClients();
    return Seamless.connections.delete(connection.url);
  }
};
