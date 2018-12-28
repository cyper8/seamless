import { poller } from '../src/poller.js';

let receiver = jasmine.createSpy('receiver_function');
let transmitter;

describe("poller async function connects to endpoint and", function() {
  beforeAll(function(done) {
    poller('http://localhost:8080/gtest/100000000000000000000000', receiver)
    .then((transmit)=>{
      transmitter = transmit;
      done();
    });
  });
  it('should return a function', function() {
    expect(typeof transmitter === 'function').toBeTruthy();
  });
  it('should receive initial data', function() {
    expect(receiver).toHaveBeenCalledWith({
      "_id": "100000000000000000000000",
      "type": "greeting",
      "count": 1,
      "hoverable": false,
      "message": "Hello!",
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
