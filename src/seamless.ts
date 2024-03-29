import { md5, MD5Hash } from "./md5.js";
import { ComplementUrl, URLString } from "./utils/complement-url.js";
import { Connection } from "./connection.js";

const MD5 = md5();

declare interface Seamless {
  connections: Map<MD5Hash, Connection>;
  compile(root: HTMLElement): Promise<Connection[]>;
  getConnection(endpoint: string): Connection;
  connect(endpoint: string): Connection;
  disconnect(endpoint: string): Boolean;
  shutdown(): void;
}

export const Seamless: Seamless = {
  connections: new Map<MD5Hash, Connection>(),

  compile(root: HTMLElement): Promise<Connection[]> {
    let clients: NodeListOf<HTMLElement> =
      root.querySelectorAll("*[data-seamless]");
    let new_connections: Array<Promise<Connection>> = [];
    for (let i = 0; i < clients.length; i++) {
      let clientNode: HTMLElement = clients[i];
      new_connections.push(
        Seamless.connect(clientNode.dataset.seamless).bindClients([clientNode])
          .established
      );
    }
    return Promise.all(new_connections);
  },

  getConnection(endpoint) {
    let url: URLString = ComplementUrl(endpoint);
    return Seamless.connections.get(MD5(url as string));
  },

  connect(endpoint) {
    let connection = Seamless.getConnection(endpoint);
    if (!connection) {
      connection = new Connection(endpoint);
      Seamless.connections.set(MD5(<string>connection.url), connection);
    }
    return connection;
  },

  disconnect(endpoint) {
    let connection = Seamless.getConnection(endpoint);
    connection.unbindClients();
    connection.close();
    return Seamless.connections.delete(MD5(<string>connection.url));
  },

  shutdown() {
    let endpoint;
    for (endpoint in Seamless.connections.keys) {
      Seamless.disconnect(endpoint);
    }
  },
};
