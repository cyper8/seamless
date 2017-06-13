var elementfactory = require('basic-library/src/UI/Element.js').element;

function getElements(id,el){
  var r=[];
  if (!el.length) el=[el];
  for (var i=0;i<el.length;i++){
    var e=el[i].querySelectorAll("#"+id);
    if (e.length==0){
      (e=[]).push(el[i].appendChild(elementfactory("div#"+id)));
    }
    for (var j=0;j<e.length;j++){
      r.push(e[j]);
    }
  }
  return r;
}

module.exports = function SeamlessSync(data){
  
  var key;
  for (key in data){
    if ((key == "_id") || (typeof data[key] === "boolean")) {
      this.setAttribute(key,data[key]);
    }
    else {
      switch(typeof data[key]){
        case "number":
        case "string":
          getElements(key,this).forEach(function(e){
            if (/input/i.test(e.tagName)) {
              e.value = data[key];
              if (!e.onchange) {
                e.onchange=function(evt){
                  clearTimeout(this.timeout);
                  this.timeout = setTimeout(function(){
                    data[this.id] = this.value;
                    this.dispatchEvent(
                      new CustomEvent(
                        'seamlessdatachange',{bubbles:true}
                      )
                    );
                  }.bind(this),1000);
                };
              }
            }
            else e.innerText = data[key];
          });
          break;
        case "object":
          getElements(key,this).forEach(function(e){
            SeamlessSync.apply(e,data[key]);
          })
      }
    }
  }
}