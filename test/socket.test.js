import { socket } from '../src/socket.js';

let receiver;
let transmitter;

describe('socket async function connects to ws endpoint and ', function() {
  beforeAll(function(done) {
    receiver = jasmine.createSpy('receiver_spy', done).and.callThrough();
    socket('ws://localhost:8081/gtest/100000000000000000000000', receiver)
    .then((transmit)=>{
      transmitter = transmit;
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
});
