/* global Seamless, expect, beforeEach, afterEach */

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
  element.dataset.seamless = "/gtest/0100";
  document.body.appendChild(element);
  element = document.createElement("div");
  element.dataset.seamless = "/gtest/0101";
  element.dataset.sync = "SyncTest";
  document.body.appendChild(element);
  Seamless.compile(document.body).then(done);
});

afterEach(function() {
  document.body.innerHTML = "";
});

describe("Seamless", function() {
  it("has binded one client to each of the two endpoints", function() {
    var c,
      n = 0;
    for (c in Seamless.connections) {
      expect(Seamless.connections[c].clients.length).toBe(1);
      n++;
    }
    ;
    expect(n).toBe(2);
  });
  it("has one client populated by default sync", function() {
    var elem = Seamless.getConnection("/gtest/0100").clients[0];
    expect(elem.children.length).toBe(4);
    expect(elem.getAttribute("_id")).toBe("0100");
    expect(elem.getAttribute("hoverable")).toBe("false");
  });
  it("has other client populated by SyncTest function", function() {
    var elem = Seamless.getConnection("/gtest/0101").clients[0];
    expect(elem.children.length).toBe(0);
    expect(elem.innerText).toMatch(/0101/);
    expect(elem.seamless).toMatch(/SyncTest/);
  })
});
