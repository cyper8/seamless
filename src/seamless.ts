import { storage as storage_f } from './storage';
import { SeamlessSync } from './ssync';
import { socket } from './socket';
import { poller } from './poller';
import { ComplementUrl } from './utils/complement-url.js';
import { md5 as md5_mod } from './md5.js';

declare interface Connection {
    url: string
    hashes: {
      url: string
      dataHash: string
    }
    data: Object
    clients: Array<SeamlessObject | SeamlessElement>
    bindClients(elements: Array<SeamlessObject | SeamlessElement> | SeamlessObject | SeamlessElement): Promise<Function>
    unbindClients(elements?: Array<SeamlessObject | SeamlessElement> | SeamlessObject | SeamlessElement): Promise<Function>
}

declare interface Seamless {
    connections: Object
    compile(root: HTMLElement): Promise<Array<Connection>>
    getConnection(url: string): Connection
    connect(endpoint: string): Connection
    disconnect(endpoint: string): void
}

declare interface SeamlessObject extends Object {
  seamless: Function
  deseamless: Function
  connection: Promise<Function>
  status: Object
}

declare interface SeamlessElement extends SeamlessObject, HTMLElement {

}

const md5 = md5_mod();

export function Seamless(): Seamless {
  const storage = storage_f();

  function getBufferByURLHash(urlhash: string): Object {
    let dh: string = storage.getItem(urlhash);
    let d: Object;

    if (dh) {
      try {
        d = JSON.parse(storage.getItem(dh));
      } catch (err) {
        throw err;
      }
    }
    else {
      d = undefined;
    }
    return d;
  }

  function Connect(endpoint: string): Connection {
    let url: string = ComplementUrl(endpoint);
    let rh: string = md5(url);
    let connection: Connection;
    // let connection: Connection = this.getConnection(url);
    let buffer: Object = getBufferByURLHash(rh);
    let InitConnection: Promise<Function>;

    // if (connection) return connection;

    // new connection

    InitConnection = new Promise(function(resolve) {
      let transmitter: Function;
      let Transmit: Function;
      let Receive: Function;

      function bufferedHandle(data: Object|string, to: Function): void {
        let d: string;
        let odh: string = storage.getItem(rh);

        if (typeof data !== "string") {
          try {
            d = JSON.stringify(data);
          } catch (err) {
            throw err;
          }
        } else {
          try {
            d = data;
            data = JSON.parse(d);
          } catch (err) {
            throw err;
          }
        }

        to(buffer = data);
        let dh: string = md5(d);

        if (odh !== dh) {
          storage.removeItem(odh);
          storage.setItem(dh, d);
          storage.setItem(rh, dh);
        }
      }

      Receive = function(res): void {
        var data: Object|string = (res.data) ? res.data : res;
        if (data && data != "false") {
          bufferedHandle(data, ToDOM);
          resolve(Transmit);
        } else {
          throw new Error("Connection lost.");
        }
      };

      function ToDOM(data) {
        connection.clients.forEach(function(e) {
          if (e.seamless) e.seamless(data);
          else
            e.status = data;
        });
      }

      transmitter = (function(callback): Function {
        if ((!(url.search(/^wss?:\/\//i) < 0)) && WebSocket) {
          return socket(url, callback);
        } else {
          return poller(url.replace(/^ws/, "http"), callback);
        }
      })(Receive);

      Transmit = function(data) {
        bufferedHandle(data, transmitter);
      };
    });

    this.connections[rh] = connection = {
      url: url,
      hashes: {
        url: rh,
        get dataHash() {
          return storage.getItem(connection.hashes.url);
        }
      },
      get data() {
        return buffer;
      },
      clients: [],
      bindClients: function(elems: Array<SeamlessObject | SeamlessElement> | SeamlessObject | SeamlessElement): Promise<Function> {
        if (!(elems instanceof Array)) {
          elems = [elems];
        }
        elems.forEach(function(e, i, a) {
          e.connection = InitConnection
            .then(function(transmit) {
              function SeamlessDataChangeEventHandler(evt) {
                transmit(buffer);
                evt.stopPropagation();
              }
              if (e instanceof HTMLElement) {
                e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
                  e.seamless = window[e.dataset.sync].bind(e);
                } else {
                  e.seamless = SeamlessSync.bind(e);
                }
                e.deseamless = function() {
                  this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
                  delete this.seamless;
                  delete this.connection;
                }.bind(e);
                e.seamless(buffer, transmit);
              } else {
                if (typeof e === "object") {
                  Object.defineProperty(e,"status",{
                    get() {
                      return buffer;
                    },
                    set(v) {
                      transmit(v);
                    },
                    enumerable: true
                  });
                } else if (typeof e === "function") {
                  a[i] = {
                    connection: InitConnection,
                    status: buffer,
                    seamless: e,
                    deseamless: function() {
                      delete this.seamless;
                      delete this.connection;
                    }
                  };
                }
                e.status = buffer;
              }
              return transmit;
            });
          connection.clients.push(e);
        });
        return InitConnection;
      },
      unbindClients: function(elems) {
        if (!elems)
          elems = connection.clients;
        if (!(elems instanceof Array))
          elems = [elems];
        elems.forEach(function(e) {
          var index = connection.clients.indexOf(e);
          if (index >= 0) {
            e = connection.clients.splice(index, 1)[0];
            if (e.deseamless) e.deseamless();
            else {
              e.connection.then(function() {
                e.deseamless();
              });
            }
          }
        });
        return InitConnection;
      }
    };
    return connection;
  }

  return {

    compile: async function(dom: HTMLElement): Promise<any> {
      let seamlessElements: NodeListOf<HTMLElement> = dom.querySelectorAll("*[data-seamless]");
      let connections: Array<Promise<Function>> = [];
      for (let i = 0; i < seamlessElements.length; i++) {
        let el: HTMLElement = seamlessElements[i];
        connections.push(this.with(el.dataset.seamless).bindClients(el));
      }
      return Promise.all(connections);
    },

    getConnection: function(endpoint: string): Connection { // connection
      let url = ComplementUrl(endpoint);
      return this.connections[md5(url)];
    },

    connect: function(endpoint: string): Connection { // connection object closure
      return this.getConnection(endpoint) || Connect(endpoint);
    },

    disconnect: function(endpoint) {
      var url = ComplementUrl(endpoint);
      this.getConnection(url).unbindClients();
      delete this.connections[md5(url)];
    },

    connections: {},
  };
}
