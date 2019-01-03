import { URLString } from './utils/complement-url.js';
import { Socket } from './socket.js';
import { Poller } from './poller.js';

export interface ChannelBackend {
  transmitter: Promise<(data: BodyInit)=>Promise<void>>
  close(): void
}

export class Channel {
  private __backend: ChannelBackend

  get egress(): Promise<(data: BodyInit)=>Promise<void>> {
    return this.__backend.transmitter;
  }

  close(): void {
    this.__backend.close();
  }

  constructor(url: URLString, ingress: Function) {
    if (((url.search(/^wss?:\/\//i) >= 0)) && WebSocket) {
      this.__backend = new Socket(url, ingress);
    } else {
      this.__backend = new Poller(url.replace(/^ws/, "http"), ingress);
    }
  }

}
