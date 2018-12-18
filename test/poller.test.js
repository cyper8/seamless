import { poller } from '../src/poller.js';

let receiver = jasmine.createSpy('receiver_function');
let transmitter;

describe("poller async function connects to endpoint and", function() {
  beforeAll(async function() {
    transmitter = await poller('http://localhost:8080/gtest/100000000000000000000000', receiver);
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
  it('should keep polling data', async function() {
    let watch_receive = await (new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(receiver);
      }, 30000);
    }));
    expect(watch_receive).toHaveBeenCalledTimes(2);
  }, 35000);
});
