/*  global localStorage, CustomEvent  */

export function storage(): Storage {

  function storageAvailable(type: "localStorage" | "sessionStorage"): Boolean {
  	try {
  		var storage = window[type],
  			x = '__storage_test__';
  		storage.setItem(x, x);
  		storage.removeItem(x);
  		return true;
  	}
  	catch(e) {
  		return false;
  	}
  }

  if (storageAvailable('localStorage')){
    return window.localStorage;
  }
  else {
    return Object.defineProperties({},{
      'setItem': {
        value: function(k: string,v: string): string {
          var e: StorageEvent = new StorageEvent('storage',{
            key:k,
            oldValue:this[k],
            newValue:v,
            storageArea:this
          });
          this[k] = v;
          (window || self).dispatchEvent(e);
          return v; // incompatible with Storage interface - it should return void
        }
      },
      'getItem': {
        value: function(k: string): string|null {
          return this[k] || null;
        }
      },
      'removeItem': {
        value: function(k: string): Storage {
          let v = this[k];
          delete this[k];
          window.dispatchEvent(
            (
              new StorageEvent('storage', {
                key: k,
                oldValue: v,
                newValue: undefined,
                storageArea: this
              })
            )
          );
          return this;
        }
      },
      'key': {
        value: function(n: number): string|undefined {
          var i,c=0;
          for (i in this){
            if (c==n) return this[i];
            c++;
          }
        }
      },
      'clear': {
        value: function(): Storage {
          var i;
          for (i in this){
            this.removeItem(i);
          }
          return this;
        }
      },
      'length': {
        get: function(): number{
          var i,c=0;
          for (i in this){
            c++;
          }
          return c;
        }
      }
    });
  }

}
