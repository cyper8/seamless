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

function seamlessSync(data,root){
  var incoming={},outgoing={},base={};

  if (typeof data !== "object"){
    data=Object.defineProperty({},root.id.toString(),{value:data,enumerable:true});
  }

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

  function sync(d,id,bd,od,el){
    for (k in d){
      var v=d[k];
      var els=getEls(el,k);
      switch(typeof v){
        case "number":
        case "string":
          var is=function(a){
            if (bd[k] != a){
              bd[k]=a;
              els.forEach(function(e,idx,ar){
                if (e.value) e.value=a;
                else e.innerText=a;
              });
            }
          }
          var os=function(a){
            if (bd[k] != a){
              bd[k]=a;
              els.forEach(function(e,idx,ar){
                if (e.value) e.value=a;
                else e.innerText=a;
              });
              var evt=CustomEvent("seamlessdatachange",{bubbles:true,detail:bd});
              el.dispatchEvent(evt);
            }
          }
          var ig,og=ig=function(){
            return bd[k];
          }
          id=Object.defineProperty({},k,{
            get: ig,
            set: is
          });
          od=Object.defineProperty({},k,{
            get: og,
            set: os
          });
          id[k]=v;
          els.forEach(function(e,idx,ar){
            if (e.value){
              e.addEventListener("change",function(e){
                if (e.target == this){
                  od[k]=this.value;
                }
              })
            }
          })
          break;
        case "object":
          id[k]={};
          od[k]={};
          bd[k]={};
          sync(d[k],id[k],bd[k],od[k],els);
          break;
        default:
      }
    }
  }
  root.seamless={
    data: incoming
  }
  sync(data,incoming,base,outgoing,root);
}
