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

var element;
beforeEach(function(done) {
  element = document.createElement("div");
  //element.dataset.seamless = "/gtest/0100";
  document.body.appendChild(element);
  //Seamless.compile(document.body).then(done);
  Seamless.with("/gtest/0100", {
    noWorker: true
  }).bindClients(element).then(done);
});


describe("Seamless", function() {
  it("populates element", function() {
    expect(element.children.length).toBeGreaterThan(0);
  })
})