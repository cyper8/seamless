import { URLString } from "./utils/complement-url.js";
import { ChannelBackend } from "./channel.js";

export class Socket implements ChannelBackend {
  socket: WebSocket;
  private __connection: Promise<WebSocket>;
  private __url: URLString;
  private __receive: Function;
  private __timer: number;
  private __reconnectCount: number = 0;
  private __errorCount: number = 0;

  get transmitter(): Promise<(data: BodyInit) => Promise<void>> {
    return this.__connection.then(() => this.__send.bind(this));
  }

  private __send(data: Blob | string | ArrayBuffer): void {
    this.__connection.then(function (active_socket: WebSocket) {
      active_socket.send(data);
    });
  }

  private __connect(): Promise<WebSocket> {
    return new Promise<WebSocket>((resolve) => {
      this.socket = new WebSocket(<string>this.__url);
      this.__timer = window.setTimeout(this.socket.close, 9000);
      this.socket.onclose = () => {
        clearTimeout(this.__timer);
        this.__reconnectCount++;
        if (this.__reconnectCount < 5) this.__connection = this.__connect();
        else throw new Error(this.__url + " does not answer");
      };
      this.socket.onerror = (e) => {
        console.error(e);
        this.__errorCount++;
        if (this.__errorCount > 10) {
          this.__errorCount = 0;
          this.socket.close();
        }
      };
      this.socket.onopen = () => {
        clearTimeout(this.__timer);
        this.__reconnectCount = 0;
        this.__errorCount = 0;
        resolve(this.socket);
      };
      this.socket.onmessage = (e) => {
        let data: Object;
        try {
          data = JSON.parse(e.data);
        } catch (error) {
          throw error;
        }
        if (data) {
          this.__receive(data);
        }
      };
    });
  }

  close(): void {
    this.socket.onclose = undefined;
    this.socket.close();
  }

  constructor(url: URLString, receive: Function) {
    this.__url = url;
    this.__receive = receive;
    this.__connection = this.__connect();
  }
}
