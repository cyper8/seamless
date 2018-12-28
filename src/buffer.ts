import { md5, MD5Hash } from './md5.js';
import { storage } from './storage.js';

const MD5 = md5();
const STORAGE:Storage = storage();

export class Buffer {
  hash: MD5Hash
  datahash: Promise<MD5Hash>
  cache: Promise<Object>|Object

  constructor(url:string) {
    this.hash = MD5(url);
    this.__init();
  }

  async __init(): Promise<Buffer> {
    await (this.datahash = Promise.resolve(STORAGE.getItem(<string>this.hash)));
    await this.__retrieve();
    return this;
  }

  async read(): Promise<Object> {
    return Promise.race([
      this.cache,
      this.__retrieve()
    ]);
  }

  async __retrieve():Promise<Object> {
    let dh = await this.datahash;
    return this.__cache(STORAGE.getItem(<string>dh) || '');
  }

  __cache(data:string):string {
    let d;
    if (data !== '') {
      try {
        d = JSON.parse(data);
      } catch(error) {
        console.error(error);
      }
    }
    return (this.cache = d);
  }

  async write(v:Object):Promise<Object> {
    let odh = await this.datahash;
    let val: string;
    try {
      val = JSON.stringify(v);
    } catch(error) {
      console.error(error);
      val = '';
    }
    let dh:MD5Hash = MD5(val);
    if (dh !== odh) {
      this.datahash = Promise.resolve(STORAGE.removeItem(<string>odh))
      .then(()=>{
        this.__cache(val);
        Promise.resolve(STORAGE.setItem(<string>dh,val));
        Promise.resolve(STORAGE.setItem(<string>this.hash, <string>dh));
        return dh;
      });
    }
    return v;
  }

  get data() {
    if (this.cache instanceof Object) {
      return this.cache;
    } else {
      return undefined;
    }
  }

  set data(v) {
    this.write(v);
  }

  async clear(): Promise<Buffer> {
    let dh = await this.datahash;
    STORAGE.removeItem(<string>dh);
    STORAGE.removeItem(<string>this.hash);
    return await this.__init();
  }

}
