import { Socket } from '../src/socket.js';

let socket;
let receiver;
let transmitter;

describe('socket async function connects to ws endpoint and ', function() {
  beforeAll(function(done) {
    receiver = jasmine.createSpy('receiver_spy', done).and.callThrough();
    socket = new Socket('ws://localhost:8081/gtest/100000000000000000000000', receiver);
    socket.transmitter.then((transmit)=>{
      transmitter = transmit;
    });
  });
  afterAll(function() {
    socket.close();
  });
  it('should provide a transmitter function', function() {
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
