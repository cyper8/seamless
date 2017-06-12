function element(desc){
    var type = (desc||"").match(/^[a-z][a-z0-9]*/i);
    var classes = desc.match(/\.([a-z][a-z0-9]*)/ig) || [];
    var id = desc.match(/\#([a-z][a-z0-9]*)/i) || [];
    if (type=="") return null;
    var element = document.createElement(type[0]);
    element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
    element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
    return element;
}

module.exports = function seamlessSync(data,root,send){
  var incoming={},base={};

  if (typeof data !== "object"){
    throw new TypeError("Wrong argument data type!");
  }

  function CastChanges(evt){
    evt.stopPropagation();
    send(evt.detail);
  }

  root.addEventListener("seamlessdatachange",CastChanges);

  function getEls(el,id){
    var r=[];
    if (!el.length) el=[el];
    for (var i=0;i<el.length;i++){
      var e=el[i].querySelectorAll("#"+id);
      if (e.length==0){
        (e=[]).push(el[i].appendChild(element("div#"+id)));
      }
      for (var j=0;j<e.length;j++){
        r.push(e[j]);
      }
    }
    return r;
  }

  function createKey(k,d,i,b,e){
    switch(typeof d[k]){
      case "boolean":
        e.forEach(function(el){
          el.setAttribute(k,d[k]);
        });
        break;
      case "number":
      case "string":
        var is=function(a){
          if (b[k] != a){
            b[k]=a;
            e.forEach(function(e,idx,ar){
              if (/input/i.test(e.tagName)) e.value=a;
              else e.innerText=a;
            });
          }
        }
        var os=function(a){
          if (d[k] != a){
            d[k]=a;
            e.forEach(function(e,idx,ar){
              if (/input/i.test(e.tagName)) e.value=a;
              else e.innerText=a;
            });
            var evt=new CustomEvent("seamlessdatachange",{bubbles:true,detail:data});
            root.dispatchEvent(evt);
          }
        }
        var ig=function(){
          return b;
        }
        Object.defineProperty(i,k,{
          get: ig,
          set: is,
          enumerable: true
        });
        // id[k]=v;
        e.forEach(function(e,idx,ar){
          if (/input/i.test(e.tagName)){
            function LocalChange(e){
              if (e.target == this){
                os(this.value);
              }
            }
            e.addEventListener("change",LocalChange);
            e.removeSeamlessCallback=function(){
              e.removeEventListener("change",LocalChange);
            };
          }
        });
        break;
      case "object":
        i[k]={};
        b[k]={};
        for (n in d[k]){
          createKey(n,d[k],i[k],b[k],getEls(e,n));
        }
        break;
      default:
    }
  }

  function syncD(k,d,i,b,e){
    if (!i[k]){
      createKey(k,d,i,b,e);
    }
    switch(typeof d[k]){
      case "boolean":
        e.forEach(function(el){
          el.setAttribute(k,d[k]);
        })
      case "number":
      case "string":
        i[k]=d[k];
        break;
      case "object":
        for (n in d[k]){
          syncD(n,d[k],i[k],b[k],getEls(e,n));
        }
        break;
      default:
    }
  }

  function sync(d){
    for (k in d){
      syncD(k,d,incoming,base,getEls(root,k));
    }
  }
  sync(data);

  root.seamless = sync;
  root.deseamless = function(){
    (function DeSeamlessChild(c){
      if (c.value){
        c.removeSeamlessCallback();
        delete c.removeSeamlessCallback;
      }
      for (i in c){
        DeSeamlessChild(c[i]);
      }
    })(root);
    root.removeEventListener("seamlessdatachange",CastChanges);
    delete root.seamless;
    incoming = {};
    delete root.deseamless;
  };

  return root;
};
