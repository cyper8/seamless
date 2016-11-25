

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
