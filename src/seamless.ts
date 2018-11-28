import { storage as storage_f } from './storage.js';
import { SeamlessSync } from './ssync.js';
import { socket } from './socket.js';
import { poller } from './poller.js';
import { ComplementUrl } from './utils/complement-url.js';
import { md5 as md5_mod } from './md5.js';

declare interface Connection {
    url: string
    hashes: {
      url: string
      dataHash: string
    }
    data: Object
    clients: Array<any>
    bindClients(elements: Array<HTMLElement|Function|Object>): Connection
    unbindClients(elements?: Array<SeamlessElement|SeamlessFunction|SeamlessObject>): Connection
}

declare interface Seamless {
  connections: Map<string,Promise<Connection>>
  compile(root: HTMLElement): Promise<Connection[]>
  getConnection(url: string): Promise<Connection>
  connect(endpoint: string): Promise<Connection>
  disconnect(endpoint: string): Boolean
}

declare interface SeamlessObject extends Object {
  connection: Promise<Connection>
  seamless: Function
  deseamless: Function
  status: Object
}

declare interface SeamlessElement extends SeamlessObject, HTMLElement {

}

declare interface SeamlessFunction extends SeamlessObject, Function {

}

const md5 = md5_mod();
const storage = storage_f();

function getBufferByURLHash(urlhash: string): Object {
  let h: string = storage.getItem(urlhash);
  let d: Object;

  if (h) {
    try {
      d = JSON.parse(storage.getItem(h));
    } catch (err) {
      throw err;
    }
  }
  else {
    d = undefined;
  }
  return d;
}

async function Connect(endpoint: string): Promise<Connection> {
  let url: string = ComplementUrl(endpoint);
  let rh: string = md5(url);
  let connection: Connection;
  let buffer: Object = getBufferByURLHash(rh);
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

  Receive = function(res: any): void {
    var data: Object|string = (res.data) ? res.data : res;
    if (data && data != "false") {
      bufferedHandle(data, ToDOM);
    } else {
      throw new Error("Connection lost.");
    }
  };

  function ToDOM(data: Object) {
    connection.clients.forEach(function(e) {
      if (e.seamless) e.seamless(data);
      else
      e.status = data;
    });
  }

  transmitter = await (async function(callback): Promise<Function> {
    if ((!(url.search(/^wss?:\/\//i) < 0)) && WebSocket) {
      return await socket(url, callback);
    } else {
      return await poller(url.replace(/^ws/, "http"), callback);
    }
  })(Receive);

  Transmit = function(data: Blob|string|ArrayBuffer) {
    bufferedHandle(data, transmitter);
  };

  connection = {
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
    set data(d){
      Transmit(d)
    },
    clients: [],
    bindClients: function(elems) {
      if (!(elems instanceof Array)) {
        elems = new Array(elems);
      }

      elems.forEach(function(e, i, a) {

        function SeamlessDataChangeEventHandler(evt) {
          Transmit(buffer);
          evt.stopPropagation();
        }

        let seamless_prop: PropertyDescriptor = {
          value: Function,
          enumerable: true,
          writable: true,
        };

        let deseamless_prop: PropertyDescriptor = {
          value: function deseamless() {
            delete this.seamless;
            if (this.removeEventListener) {
              this.removeEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
            }
          }.bind(e),
          enumerable: true,
          writable: true,
        };

        let status_prop: PropertyDescriptor = {
          get() {
            return buffer;
          },
          set(v) {
            Transmit(v)
          },
          enumerable: true,
          writable: true,
        };

        if (e instanceof HTMLElement) {
          e.addEventListener('seamlessdatachange', SeamlessDataChangeEventHandler);
          if (e.dataset.sync && (typeof window[e.dataset.sync] === "function")) {
            seamless_prop.value = window[e.dataset.sync].bind(e);
          } else {
            seamless_prop.value = SeamlessSync.bind(e);
          }
        } else {
          if (typeof e === "function") {
            seamless_prop.value = e.bind(e);
          } else if (typeof e === "object") {
            seamless_prop.value = false;
          }
        }

        Object.defineProperties(e, {
          seamless: seamless_prop,
          deseamless: deseamless_prop,
          status: status_prop,
        });

        e["seamless"](buffer);

        connection.clients.push(a[i]);
      });

      return connection;
    },
    unbindClients: function(elems): Connection {
      if (!elems)
      elems = connection.clients;
      elems.forEach(function(e) {
        var index = connection.clients.indexOf(e);
        if (index >= 0) {
          e = connection.clients.splice(index, 1)[0];
          if (e.deseamless) e.deseamless();
        }
      });
      return connection;
    }
  };

  return connection;
}

export const Seamless: Seamless = {

    compile: function(dom: HTMLElement): Promise<Connection[]> {
      let seamlessElements: NodeListOf<HTMLElement> = dom.querySelectorAll("*[data-seamless]");
      for (let i = 0; i < seamlessElements.length; i++) {
        let el: HTMLElement = seamlessElements[i];
        Seamless.connect(el.dataset.seamless).then((connection)=>connection.bindClients([el]));
      }
      return Promise.all(Seamless.connections.values());
    },

    getConnection: function(endpoint: string): Promise<Connection> { // connection
      let url = ComplementUrl(endpoint);
      return this.connections.get(md5(url));
    },

    connect: function(endpoint: string): Promise<Connection> { // connection object closure
      let connection =  this.getConnection(endpoint);
      if (!connection) {
        connection = Connect(endpoint);
        Seamless.connections.set(connection.hashes.url, connection);
      }
      return connection;
    },

    disconnect: function(endpoint): Boolean {
      var url = ComplementUrl(endpoint);
      this.getConnection(url).unbindClients();
      return Seamless.connections.delete(md5(url));
    },

    connections: new Map([]),
}
