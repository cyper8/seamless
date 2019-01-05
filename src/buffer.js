import { md5 } from './md5.js';
import { storage } from './storage.js';
const MD5 = md5();
const STORAGE = storage();
export class Buffer {
    constructor(url) {
        this.hash = MD5(url);
        this.__init();
    }
    __init() {
        this.datahash = Promise.resolve(STORAGE.getItem(this.hash));
        return (this.cache = this.__retrieve()).then(() => this);
    }
    read() {
        return Promise.race([
            this.cache,
            this.__retrieve()
        ]);
    }
    __retrieve() {
        return this.datahash
            .then((dh) => STORAGE.getItem(dh) || '')
            .then((data) => this.__cache(data));
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
        let val;
        try {
            val = JSON.stringify(v);
        }
        catch (error) {
            console.error(error);
            val = '';
        }
        let dh = MD5(val);
        return this.datahash.then((odh) => {
            if (dh !== odh) {
                this.datahash = Promise.resolve(STORAGE.removeItem(odh))
                    .then(() => {
                    this.__cache(val);
                    STORAGE.setItem(dh, val);
                    STORAGE.setItem(this.hash, dh);
                    return dh;
                });
            }
            return v;
        });
    }
    get data() {
        if (this.cache instanceof Object && !(this.cache instanceof Promise)) {
            return this.cache;
        }
        else {
            return undefined;
        }
    }
    set data(v) {
        this.write(v);
    }
    clear() {
        return this.datahash
            .then((dh) => {
            STORAGE.removeItem(dh);
            STORAGE.removeItem(this.hash);
        })
            .then(() => this.__init());
    }
}
//# sourceMappingURL=buffer.js.map