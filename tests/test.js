function sync(arg){
  var c,root = arguments[1] || document.body;
  var r=$(root);
  if (typeof arg === "string"){
    if (arg == ""){
      r.html("");
      return true;
    }
    try{
      arg=JSON.parse(arg);
    }
    catch(error){
      console.log(error);
      return false;
    }
  }
  if (typeof arg === 'object'){
    if (Object.keys(arg).length === 0){
      r.html("");
      return true;
    }
  }
  if (typeof arg === "function"){
    r.each(function(i,n){arg.apply(n,[])});
  }
  for (t in arg){
    r.each(function(ri,re){
      if (typeof re[t] === "function"){
        re[t].apply(re,[arg[t]]);
        return;
      }
      if ((c=$(re).find("#"+t)).length<1){
        try {
          c=$('<div id="'+t+'"></div>').appendTo(r);
        }
        catch(error){
          console.log(error);
          return;
        }
      }
      switch (typeof arg[t]){
        case "string":
        case "number":
          c.each(function(i,n){n.innerHTML = arg[t].toString()});
          break;
        case "function":
          c.each(arg[t].bind(re));
          break;
        case "object":
          c.each(function(i,n){sync(arg[t],n)});
          break;
        default:
          console.log("Unknown type: "+typeof arg[t]);
      }
    });
  }
  return root;
}

Seamless
  .connect(
    "wss://seamless-cyper8.c9users.io/test",
    function(resp){
      var out = document.querySelector("#output");
      out.value=JSON.stringify(resp.data);
      document.querySelector("#input")
        .addEventListener(
          'click',
          function(e){
            resp.data=out.value;
          }
        );
      
    }
  );