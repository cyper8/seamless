/* global Seamless, expect, beforeAll, afterAll */

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
    });
  }
}

var element1,
  element2;

beforeAll(function(done) {
  element1 = document.createElement("div");
  element1.setAttribute("data-seamless", "/gtest/100000000000000000000000");
  document.body.appendChild(element1);
  element2 = document.createElement("div");
  element2.setAttribute("data-seamless", "/gtest/100000000000000000000001");
  element2.setAttribute("data-sync", "SyncTest");
  document.body.appendChild(element2);
  Seamless.compile(document.body).then(done);
});

afterAll(function() {
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
    expect(n).toBe(2);
  });
  it("has one client populated by default sync", function(done) {
    function Tests() {
      expect(element1.children.length).toBe(4);
      expect(element1.getAttribute("_id")).toBe("100000000000000000000000");
      expect(element1.getAttribute("hoverable")).toBe("false");
      done();
    }
    element1.connection.then(Tests);
  });
  it("has other client populated by SyncTest function", function(done) {
    function Tests() {
      expect(element2.children.length).toBe(0);
      expect(element2.innerText).toMatch(/100000000000000000000001/);
      expect(element2.seamless).toMatch(/SyncTest/);
      done();
    }
    element2.connection.then(Tests);
  });
});
