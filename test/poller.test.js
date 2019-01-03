import { Poller } from '../src/poller.js';

let poller;
let receiver;
let transmitter;

describe("poller async function connects to endpoint and", function() {
  beforeAll(function(done) {
    receiver = jasmine.createSpy('receiver_function', done).and.callThrough();
    poller = new Poller('http://localhost:8080/gtest/100000000000000000000001', receiver);
    poller.transmitter.then((transmit)=>{
      transmitter = transmit;
    });
  });
  afterAll(function() {
    poller.close();
  });
  it('should return a function', function() {
    expect(typeof transmitter === 'function').toBeTruthy();
  });
  it('should receive initial data', function() {
    expect(receiver).toHaveBeenCalledWith({
      "_id": "100000000000000000000001",
      "type": "introduction",
      "count": 1,
      "hoverable": true,
      "message": "I'm Seamless",
      "addresee": "Bob"
    });
  });
  it('should keep polling data', function(done) {
    (new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(receiver);
      }, 34000);
    }))
    .then((callback)=>{
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
  }, 35000);
});
