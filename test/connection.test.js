import { Connection } from '../src/connection.js';
import { Buffer } from '../src/buffer.js';

const testUrl = 'http://localhost:8080/gtest/100000000000000000000000';
const testElement = document.createElement('div');
let testConnection;

document.body.appendChild(testElement);

describe(`Connection instance`, function() {
  beforeAll(function() {
    testConnection = new Connection(testUrl);
  });
  it('should have url property', function() {
    expect(testConnection.url).toEqual(testUrl);
  });
  it('should allocate buffer', function() {
    expect(testConnection.buffer).toBeDefined();
    expect(testConnection.buffer instanceof Buffer).toBeTruthy();
  });
  it('should provide methods to add clients', function() {
    expect(testConnection.bindClients).toBeDefined();
    expect(testConnection.unbindClients).toBeDefined();
    expect(typeof testConnection.bindClients).toEqual('function');
    expect(typeof testConnection.unbindClients).toEqual('function');
    expect(testConnection.bindClients([testElement])).toEqual(testConnection);
    expect(testConnection.clients.length).toBe(1);
    expect(testConnection.unbindClients()).toEqual(testConnection);
    expect(testConnection.clients.length).toBe(0);
  });
  it('should provide "then" method to chain to connection process', function(done) {
    testConnection.then((connection)=>{
      expect(connection).toBe(testConnection);
      done();
    });
  });
});
