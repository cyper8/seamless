import { Buffer } from '../src/buffer.js';
import { md5 } from '../src/md5.js';

const _MD5_ = md5();
const test_url = 'ws://test_buf';
let buffer;

beforeAll(function() {
  buffer = new Buffer(test_url);
});

afterAll(function(done) {
  buffer.clear().then(done);
});

describe('Buffer for a given url', function(){
  it('should contain a hash value for given url', function(){
    expect(buffer.hash).toBe(_MD5_(test_url));
  });

  it('should eventually get a default value into datahash and cache',
    function(done){
      buffer.clear().then(()=>{
        Promise.all([
          buffer.datahash.then(function(hash){
            return expect(hash).toBe(null);
          }),
          buffer.read().then((value) => {
            return expect(value).toBe(undefined);
          })
        ])
        .then(done);
      });
    });

  it('should enable setting new value and return it', function(done){
    let testval = {a:1,b:2};
    buffer.write(testval)
    .then((value)=>{
      expect(value).toBe(testval);
      buffer.datahash
      .then(()=>{
        expect(buffer.data).toEqual(testval);
        done();
      });
    });
  });
});
