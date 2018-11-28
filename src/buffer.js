import { md5 } from './md5';
import { storage } from './storage';
const MD5 = md5();
const STORAGE = storage();
export class Buffer {
    constructor(url) {
        this.hash = MD5(url);
        this.datahash = Promise.resolve(STORAGE.getItem(this.hash));
        this.cache = this.__retrieve();
    }
    read() {
        return Promise.race([
            this.cache,
            this.__retrieve()
        ]);
    }
    __retrieve() {
        return this.datahash
            .then((hash) => STORAGE.getItem(hash) || '')
            .then(this.__cache);
    }
    __cache(data) {
        let d;
        if (data !== '') {
            try {
                d = JSON.parse(data);
            }
            catch (error) {
                console.error(error);
            }
        }
        return (this.cache = d);
    }
    write(v) {
        return this.datahash
            .then((hash) => {
            let val;
            try {
                val = JSON.stringify(v);
            }
            catch (error) {
                console.error(error);
                val = '';
            }
            let dh = MD5(val);
            if (dh !== hash) {
                Promise.resolve(STORAGE.removeItem(hash))
                    .then(() => {
                    STORAGE.setItem(dh, val);
                    return val;
                })
                    .then(this.__cache)
                    .then(() => {
                    return (this.datahash = Promise.resolve((STORAGE.setItem(this.hash, dh), dh)));
                });
            }
            return v;
        });
    }
}
//# sourceMappingURL=buffer.js.map