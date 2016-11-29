function element(desc){
    var type = desc||"".match(/^[a-z][a-z0-9]*/i)[0];
    var classes = desc.match(/\.([a-z][a-z0-9]*)/ig) || [];
    var id = desc.match(/\#([a-z][a-z0-9]*)/i) || [];
    if (type=="") return null;
    var element = document.createElement(type[0]);
    element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
    element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
    return element;
}

module.exports = function seamlessSync(data,root,send){
  var incoming={};

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
    for (i in el){
      var e=el[i].querySelectorAll("#"+id);
      if (e.length==0){
        e.push(el[i].appendChild(element("div#"+id)));
      }
      for (j in e){
        r.push(e[j]);
      }
    }
    return r;
  }

  function createKey(k,v,i,e){
    switch(typeof v){
      case "number":
      case "string":
        var is=function(a){
          if (v != a){
            v=a;
            e.forEach(function(e,idx,ar){
              if (e.value) e.value=a;
              else e.innerText=a;
            });
          }
        }
        var os=function(a){
          if (v != a){
            v=a;
            e.forEach(function(e,idx,ar){
              if (e.value) e.value=a;
              else e.innerText=a;
            });
            var evt=new CustomEvent("seamlessdatachange",{bubbles:true,detail:data});
            root.dispatchEvent(evt);
          }
        }
        var ig=function(){
          return v;
        }
        i=Object.defineProperty({},k,{
          get: ig,
          set: is
        });
        // id[k]=v;
        e.forEach(function(e,idx,ar){
          if (e.value){
            function LocalChange(e){
              if (e.target == this){
                os(this.value);
              }
            }
            e.addEventListener("change",LocalChange);
            e.removeSeamlessCallback=function(){
              e.removeEventListener("change",LocalChange);
              delete LocalChange;
            }
          }
        })
        break;
      case "object":
        i[k]={};
        for (n in v){
          createKey(n,v[n],i[k],getEls(e,n));
        }
        break;
      default:
    }
  }

  function syncD(k,v,i,e){
    if (!i[k]){
      createKey(k,v,i,e);
    }
    switch(typeof v){
      case "number":
      case "string":
        if (v != i[k]){
          i[k]=v;
        }
        break;
      case "object":
        for (n in v){
          syncD(n,v[n],i[n],getEls(e,n));
        }
        break;
      default:
    }
  }

  (function sync(d){
    for (k in d){
      syncD(k,d[k],incoming,[root]);
    }
  })(data);

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
    delete CastChanges;
    delete root.seamless;
    incoming = {};
    delete root.deseamless;
  }

  return root;
}
