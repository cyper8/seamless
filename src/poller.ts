import { URLString } from './utils/complement-url.js';
import { AbortableFetch } from './fetch.js';
import { ajax } from './ajax.js';
import { ChannelBackend } from './channel';

export interface AbortableRequest<T> {
  request: Promise<T>,
  abort: Function
}

export class Poller implements ChannelBackend {
  request: AbortableRequest<Object>
  transmitter: Promise<(data: BodyInit)=>Promise<void>>
  private __url: URLString
  private __timer: number
  private __reconnectCount: number = 0
  private __receiver: Function

  private __request(url: URLString, data: BodyInit): Promise<void> {
    console.log(url);
    let request: AbortableRequest<Object>;
    let options: RequestInit = {
      method: (!data || data == '') ? 'GET' : 'POST',
      headers: {
        "Accept": "application/json"
      },
    };

    if (options.method === 'POST') {
      options.body = data;
      options.headers["Content-Type"] = 'application/json';
    }

    if (fetch && AbortController) {
      request = AbortableFetch(url, options);
    }
    else {
      request = ajax(url, options);
    }
    this.request = request;
    return request.request
    .then((response)=>{
      this.__receiver(response);
    });
  }

  private __Post(d: BodyInit):Promise<void> {
    return this.__request(this.__url, (typeof d !== "string") ? JSON.stringify(d) : d);
  }

  private __init(): Promise<void> {
    let resolver: (value: (data:BodyInit)=>Promise<void>)=>void;
    let rejector: (reason?: any)=>void;
    console.log('initializing');
    this.transmitter = new Promise((resolve,reject)=>{
      [resolver, rejector] = [resolve, reject]
    });
    return this.__request(this.__url + '?nopoll=true', '')
    .then(()=>{
      resolver(this.__Post.bind(this));
      console.log('initialized');
    },
    (err)=>{
      console.error(`Connection Initialization failed:`, err);
      rejector(err);
    });
  }

  private __poll():Promise<void> {
    console.log('polling');
    return this.__request(this.__url, '')
      .then(() => {
        this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
      })
      .catch((err) => {
        console.error(`Connection polling failure: `, err);
        if (this.__reconnectCount > 5) {
          window.clearTimeout(this.__timer);
          this.__reconnectCount = 0;
          console.error("Poller connection lost. Reconnection constantly failing. Try reloading page.");
          this.transmitter = Promise.reject(err);
        } else {
          console.error("Reconnecting attempt " + this.__reconnectCount++);
          this.__timer = window.setTimeout(this.__poll.bind(this), 1000);
        }
      });
  }

  close() {
    this.request.abort();
  }

  constructor(url:URLString, receiver:Function) {
    this.__url = (url.search(/^https?:\/\//i) < 0) ?
      url.replace(/^[^:]+:/i, "http:") :
      url;
    this.__receiver = receiver;
    this.__init()
    .then(()=>this.__poll());
  }
}
