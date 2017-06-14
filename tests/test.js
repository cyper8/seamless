function SyncTest(data, transmitter) {
  this.innerText = JSON.stringify(data);
  if (transmitter) {
    this.addEventListener('click', function(e) {
      if (data.count > 0) data.count--;
      transmitter(data);
    });
    this.addEventListener('contextmenu', function(e) {
      if (data.count < 3) data.count++;
      transmitter(data);
      e.preventDefault();
    })
  }
}

window.addEventListener('load', function() {
  Seamless.compile(document.body);
})