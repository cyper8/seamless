/* global Seamless, expect, beforeAll, afterAll */
import { Seamless } from '../src/seamless.js';

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
  element2,
  seamlessReady;

describe("Seamless", function() {

  beforeAll(function() {
    window.SyncTest = SyncTest;
    element1 = document.createElement("div");
    element1.setAttribute("data-seamless", "/gtest/100000000000000000000000");
    document.body.appendChild(element1);
    element2 = document.createElement("div");
    element2.setAttribute("data-seamless", "/gtest/100000000000000000000001");
    element2.setAttribute("data-sync", "SyncTest");
    document.body.appendChild(element2);
    seamlessReady = Seamless.compile(document.body);
  });
  
  afterAll(function() {
    document.body.innerHTML = "";
  });

  it('should be singleton', function() {
    expect(Seamless).toBeDefined();
    expect(typeof Seamless).toBe('object');
  });

  it('should connect to endpoints', function(done){
    seamlessReady.then((connections)=>{
      expect(connections.length).toBe(2);
      done();
    });
  });

  xit("has binded one client to each of two endpoints", function() {
    Seamless.connections.forEach((connection)=>{
      expect(connection.clients.length).toBe(1);
    });
    expect(Seamless.connection.size).toBe(2);
  });

  xit("has one client populated by default sync", function(done) {
    function Tests() {
      expect(element1.children.length).toBe(4);
      expect(element1.getAttribute("_id")).toBe("100000000000000000000000");
      expect(element1.getAttribute("hoverable")).toBe("false");
      done();
    }
    seamlessReady.then(Tests);// element1.connection.then(Tests);
  });

  xit("has other client populated by SyncTest function", function(done) {
    function Tests() {
      expect(element2.children.length).toBe(0);
      expect(element2.innerText).toMatch(/100000000000000000000001/);
      expect(element2.seamless).toMatch(/SyncTest/);
      done();
    }
    seamlessReady.then(Tests);// element2.connection.then(Tests);
  });

});
