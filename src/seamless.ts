import { md5 } from './md5';
import { ComplementUrl } from './utils/complement-url';
import { Connection } from './connection';

const MD5 = md5();

export class Seamless {
  connections: Map<string, Connection>

  constructor() {
    this.connections = new Map();
  }

  compile(root: HTMLElement): Seamless {
    let clients: NodeListOf<HTMLElement> = root.querySelectorAll('*[data-seamless]');
    for (let i = 0; i < clients.length; i++) {
      let clientNode: HTMLElement = clients[i];
      this.connect(clientNode.dataset.seamless).bindClients([clientNode]);
    }
    return this;
  }

  getConnection(endpoint): Connection {
    let url:string = ComplementUrl(endpoint);
    return this.connections.get(MD5(url));
  }

  connect(endpoint: string): Connection {
    let connection = this.getConnection(endpoint);
    if (!connection) {
      connection = new Connection(endpoint);
      this.connections.set(connection.url, connection);
    }
    return connection;
  }

  disconnect(endpoint): Boolean {
    let connection = this.getConnection(endpoint);
    connection.unbindClients();
    return this.connections.delete(connection.url);
  }
}
