import { Channel } from '../src/channel.js';

const testUrl = 'http://localhost:8080/gtest/100000000000000000000000';
let channel, ingress;

describe(`Channel wraps and aggregates networking subsystem and`, function() {
  beforeAll(function() {
    ingress = jasmine.createSpy('ChannelTestIngressSpy');
    channel = new Channel(testUrl, ingress);
    // egress = jasmine.createSpy('ChannelTestEgressSpy');
  });
  afterAll(function() {
    channel.close();
  });
  it(`should take url and ingress sink function for channel instantiation`,
    function(){
      expect(channel instanceof Channel).toBeTruthy();
    }
  );
  it(`should have property pointing to a Promise of a egress function`,
    function(done) {
      expect(channel.egress instanceof Promise).toBeTruthy();
      channel.egress.then((transmitter)=>{
        expect(typeof transmitter === 'function').toBeTruthy();
        done();
      });
    }
  );
  it(`should have desctructor function to close/abort connection`, function() {
    expect(typeof channel.close === 'function').toBeTruthy();

  });
});
