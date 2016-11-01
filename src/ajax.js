module.exports = function (url,data){
  var verb = (!data||data=='')?'GET':'POST';
  return Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function(e){
      if (this.readyState == 4){
        if (this.status == 200){
          resolve(this.response);
        }
        else {
          reject(this.status + ': ' +this.response.toString());
        }
      }
    });
    xhr.timeout = 30000;
    xhr.addEventListener("timeout",function(){
      if ((this.readyState > 0) && (this.readyState < 4))
        this.abort();
      reject('Request timed out');
    });
  	xhr.responseType = 'json';
    (xhr.executesession = function(){
      if (data == '')
      xhr.open(verb,encodeURI(url),true);
      // if (xhr.request.headers) {
      //   for (h in xhr.request.headers) {
      //     xhr.setRequestHeader(h,xhr.request.headers[h]);
      //   }
      // }
      xhr.send(data | '');
    })();
  });
};