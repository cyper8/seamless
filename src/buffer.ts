import { md5 } from './md5';
import { storage } from './storage';

const MD5 = md5();
const STORAGE:Storage = storage();

export class Buffer {
  hash: string
  datahash: Promise<string>
  cache: Promise<Object>|Object

  constructor(url:string) {
    this.hash = MD5(url);
    this.datahash = Promise.resolve(STORAGE.getItem(this.hash));
    this.cache = this.__retrieve();
  }

  read(): Promise<Object> {
    return Promise.race([
      this.cache,
      this.__retrieve()
    ]);
  }

  __retrieve():Promise<Object> {
    return this.datahash
    .then((hash)=>STORAGE.getItem(hash) || '')
    .then(this.__cache);
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

  write(v:Object):Promise<Object> {
    return this.datahash
    .then((hash:string)=>{
      let val: string;
      try {
        val = JSON.stringify(v);
      } catch(error) {
        console.error(error);
        val = '';
      }
      let dh:string = MD5(val);
      if (dh !== hash) {
        Promise.resolve(STORAGE.removeItem(hash))
        .then(()=>{
          STORAGE.setItem(dh,val);
          return val;
        })
        .then(this.__cache)
        .then(()=>{
          return (
            this.datahash = Promise.resolve(
              (STORAGE.setItem(this.hash, dh), dh)
            )
          );
        });
      }
      return v;
    });
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

}
