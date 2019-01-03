import { Buffer } from './buffer.js';
import { ComplementUrl, URLString } from './utils/complement-url.js';
import { Channel } from './channel.js';
import { SeamlessClient } from './client.js';

export class Connection {
  private __buffer: Buffer
  private __channel: Channel

  private __ToDOM(data: Object):void {
    this.clients.forEach(function(client: SeamlessClient) {
      if (client.seamless) client.seamless(data);
      else
      client.status = data;
    });
  }

  private __receiver(response:Object): void {
    this.__buffer.write(response).then((data)=>this.__ToDOM(data));
  }

  private __transmit(data:Object): Promise<void> {
    return Promise.all([
      this.__transmitter,
      this.__buffer.write(data)
    ]).then(([transmitter,data])=>{
      return transmitter(data);
    });
  }

  private get __transmitter(): Promise<Function> {
    return this.__channel.egress;
  }

  url: URLString
  clients: Array<SeamlessClient> = []

  to(url: string): Connection {
    if (this.__channel) {
      this.close();
    }
    this.url = ComplementUrl(url);
    this.__buffer = new Buffer(<string>this.url);
    this.__channel = new Channel(this.url, this.__receiver.bind(this));
    return this;
  }

  get established(): Promise<Connection> {
    return new Promise((resolve)=>{
      this.__transmitter.then(()=>{
        resolve(this);
      });
    });
  }

  close(): Connection {
    this.__channel.close();
    return this;
  }

  bindClients(elements: Array<HTMLElement|Function|Object>): Connection {
    this.clients = elements.map(
      (element) => new SeamlessClient(element, this.__transmit.bind(this), this.__buffer.data)
    );
    return this;
  }

  unbindClients(elements?: SeamlessClient[]): Connection {
    let elems = elements || this.clients;
    elems.forEach((e)=>{
      let index = this.clients.indexOf(e);
      if (index >= 0) {
        let el = this.clients.splice(index,1)[0];
        if (el.deseamless) el.deseamless();
      }
    });
    return this;
  }

  constructor(url: string) {
    this.to(url);
  }
}

// export function Connection(url: string):void {
//   var self: Connection = this;
//
//   function ToDOM(data: Object) {
//     self.clients.forEach(function(client: SeamlessClient) {
//       if (client.seamless) client.seamless(data);
//       else
//       client.status = data;
//     });
//   }
//
//   function Receiver(response:Object) {
//     self.buffer.write(response).then((data)=>ToDOM(data));
//   }
//
//   function Connect(receiver: Function):Promise<Function> {
//     let channel = new Channel(url, receiver);
//     return channel.egress;
//   }
//
//   function Transmit(data:Object) {
//     return Promise.all([
//       Transmitter,
//       self.buffer.write(data)
//     ]).then(([transmitter,data])=>{
//       return transmitter(data);
//     });
//   }
//
//
//   this.url = ComplementUrl(url);
//   this.buffer = new Buffer(this.url);
//   this.clients = [];
//
//   const Transmitter:Promise<Function> = Connect(Receiver);
//
//   this.established = new Promise((resolve)=>{
//     Transmitter.then(()=>{
//       resolve(self);
//     });
//   });
//
//   this.bindClients = function(elements: Array<HTMLElement|Function|Object>): Connection {
//     this.clients = elements.map(
//       (element) => new SeamlessClient(element, Transmit, self.buffer.data)
//     );
//     return self;
//   };
//
//   this.unbindClients = function(elements: SeamlessClient[]): Connection {
//     let elems = elements || self.clients;
//     elems.forEach((e)=>{
//       let index = self.clients.indexOf(e);
//       if (index >= 0) {
//         let el = self.clients.splice(index,1)[0];
//         if (el.deseamless) el.deseamless();
//       }
//     });
//     return self;
//   };
//
// }
