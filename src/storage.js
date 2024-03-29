/*  global localStorage, CustomEvent  */
export function storage() {
    function storageAvailable(type) {
        try {
            var storage = window[type], x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    if (storageAvailable("localStorage")) {
        return window.localStorage;
    }
    else {
        return Object.defineProperties({}, {
            setItem: {
                value: function (k, v) {
                    var e = new StorageEvent("storage", {
                        key: k,
                        oldValue: this[k],
                        newValue: v,
                        storageArea: this,
                    });
                    this[k] = v;
                    (window || self).dispatchEvent(e);
                    return v; // incompatible with Storage interface - it should return void
                },
            },
            getItem: {
                value: function (k) {
                    return this[k] || null;
                },
            },
            removeItem: {
                value: function (k) {
                    let v = this[k];
                    delete this[k];
                    window.dispatchEvent(new StorageEvent("storage", {
                        key: k,
                        oldValue: v,
                        newValue: undefined,
                        storageArea: this,
                    }));
                    return this;
                },
            },
            key: {
                value: function (n) {
                    var i, c = 0;
                    for (i in this) {
                        if (c == n)
                            return this[i];
                        c++;
                    }
                },
            },
            clear: {
                value: function () {
                    var i;
                    for (i in this) {
                        this.removeItem(i);
                    }
                    return this;
                },
            },
            length: {
                get: function () {
                    var i, c = 0;
                    for (i in this) {
                        c++;
                    }
                    return c;
                },
            },
        });
    }
}
//# sourceMappingURL=storage.js.map