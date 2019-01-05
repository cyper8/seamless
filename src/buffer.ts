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

  private __init(): Promise<Buffer> {
    this.datahash = Promise.resolve(STORAGE.getItem(<string>this.hash));
    return (this.cache = this.__retrieve()).then(()=>this);
  }

  read(): Promise<Object> {
    return Promise.race([
      this.cache,
      this.__retrieve()
    ]);
  }

  private __retrieve():Promise<Object> {
    return this.datahash
    .then((dh)=>STORAGE.getItem(<string>dh) || '')
    .then((data)=>this.__cache(data));
  }

  private __cache(data:string):string {
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

  write(v:Object):Promise<Object> {
    let val: string;
    try {
      val = JSON.stringify(v);
    } catch(error) {
      console.error(error);
      val = '';
    }
    let dh:MD5Hash = MD5(val);
    return this.datahash.then((odh)=>{
      if (dh !== odh) {
        this.datahash = Promise.resolve(STORAGE.removeItem(<string>odh))
        .then(()=>{
          this.__cache(val);
          STORAGE.setItem(<string>dh,val);
          STORAGE.setItem(<string>this.hash, <string>dh);
          return dh;
        });
      }
      return v;
    });
  }

  get data() {
    if (this.cache instanceof Object && !(this.cache instanceof Promise)) {
      return this.cache;
    } else {
      return undefined;
    }
  }

  set data(v) {
    this.write(v);
  }

  clear(): Promise<Buffer> {
    return this.datahash
    .then((dh)=>{
      STORAGE.removeItem(<string>dh);
      STORAGE.removeItem(<string>this.hash);
    })
    .then(()=>this.__init());
  }

}
