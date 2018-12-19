import { Buffer } from './buffer.js';
import { ComplementUrl } from './utils/complement-url.js';
import { socket } from './socket.js';
import { poller } from './poller.js';
import { SeamlessClient } from './client.js';

export declare interface Connection {
  url: string
  buffer: Buffer
  clients: Array<SeamlessClient>
  then(callback: (param: Connection)=>any): Promise<any>
  bindClients(elements: Array<HTMLElement|Function|Object>): Connection
  unbindClients(elements?: Array<SeamlessClient>): Connection
}

export function Connection(url: string):void {
  var self: Connection = this;

  function ToDOM(data: Object) {
    self.clients.forEach(function(client: SeamlessClient) {
      if (client.seamless) client.seamless(data);
      else
      client.status = data;
    });
  }

  function Receiver(response:Object) {
    self.buffer.write(response).then((data)=>ToDOM(data));
  }

  function Connect(receiver: Function):Promise<Function> {
    if (((self.url.search(/^wss?:\/\//i) >= 0)) && WebSocket) {
      return socket(url, receiver);
    } else {
      return poller(url.replace(/^ws/, "http"), receiver);
    }
  }

  function Transmit(data:Object) {
    return Promise.all([
      Transmitter,
      self.buffer.write(data)
    ]).then(([transmitter,data])=>{
      return transmitter(data);
    });
  }

  this.url = ComplementUrl(url);
  this.buffer = new Buffer(this.url);
  this.clients = [];
  this.then = (callback) => Transmitter.then(()=>callback(this));

  this.bindClients = function(elements: Array<HTMLElement|Function|Object>): Connection {
    this.clients = elements.map(
      (element) => new SeamlessClient(element, Transmit, self.buffer.data)
    );
    return self;
  };

  this.unbindClients = function(elements: SeamlessClient[]): Connection {
    let elems = elements || self.clients;
    elems.forEach((e)=>{
      let index = self.clients.indexOf(e);
      if (index >= 0) {
        let el = self.clients.splice(index,1)[0];
        if (el.deseamless) el.deseamless();
      }
    });
    return self;
  };

  const Transmitter:Promise<Function> = Connect(Receiver);

}
