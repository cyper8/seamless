/*  global localStorage, CustomEvent  */



module.exports = function(){
  
  function storageAvailable(type) {
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
  else{
    return Object.defineProperties(new Object(),{
      'setItem': {
        value: function(k,v){
          var e = new CustomEvent('storage',{detail:{
            key:k,
            oldValue:this[k],
            newValue:v,
            storageArea:this
          }});
          this[k] = v;
          (window || self).dispatchEvent(e);
          return v;
        } 
      },
      'getItem': {
        value: function(k){
          return this[k] || null;
        }
      },
      'removeItem': {
        value: function(k){
          delete this[k];
          return this;
        }
      },
      'key': {
        value: function(n){
          var i,c=0;
          for (i in this){
            if (c==n) return this[i];
            c++;
          }
        }
      },
      'clear': {
        value: function(){
          var i;
          for (i in this){
            this.removeItem(i);
          }
          return this;
        }
      },
      'length': {
        get: function(){
          var i,c=0;
          for (i in this){
            c++;
          }
          return c;
        }
      }
    });
  }
  
};