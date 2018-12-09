var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            yield (this.datahash = Promise.resolve(STORAGE.getItem(this.hash)));
            yield this.__retrieve();
            return this;
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.race([
                this.cache,
                this.__retrieve()
            ]);
        });
    }
    __retrieve() {
        return __awaiter(this, void 0, void 0, function* () {
            let dh = yield this.datahash;
            return this.__cache(STORAGE.getItem(dh) || '');
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            let odh = yield this.datahash;
            let val;
            try {
                val = JSON.stringify(v);
            }
            catch (error) {
                console.error(error);
                val = '';
            }
            let dh = MD5(val);
            if (dh !== odh) {
                this.datahash = Promise.resolve(STORAGE.removeItem(odh))
                    .then(() => {
                    this.__cache(val);
                    Promise.resolve(STORAGE.setItem(dh, val));
                    Promise.resolve(STORAGE.setItem(this.hash, dh));
                    return dh;
                });
            }
            return v;
        });
    }
    get data() {
        if (this.cache instanceof Object) {
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
        return __awaiter(this, void 0, void 0, function* () {
            let dh = yield this.datahash;
            STORAGE.removeItem(dh);
            STORAGE.removeItem(this.hash);
            return yield this.__init();
        });
    }
}
//# sourceMappingURL=buffer.js.map