import { AbortableFetch } from '../src/fetch.js';

const testUrl = 'http://localhost:8080/gtest/100000000000000000000000?nopoll=true';
let testData1 = {
  "_id": "100000000000000000000000",
  "type": "greeting",
  "count": 1,
  "hoverable": false,
  "message": "Hello!",
  "addresee": "Bob"
};
let testData2 = {
  "_id": "100000000000000000000000",
  "type": "greeting",
  "count": 2,
  "hoverable": false,
  "message": "Hello!",
  "addresee": "Bob"
};
let testOptions = {
  method: 'GET',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
};

let fetch;

describe('AbortableFetch', function() {
  describe('GET data', function() {
    beforeEach(function() {
      fetch = AbortableFetch(testUrl,testOptions);
    });
    it('should eventually get test data', function(done) {
      fetch.request.then((data) => {
        expect(data).toEqual(testData1);
      })
      .finally(()=>done());
    });
    it('should be able to be aborted', function(done) {
      fetch.abort();
      expectAsync(fetch.request).toBeRejected();
      fetch.request
      .catch((error)=>{
        expect(error instanceof AbortError).toBeTruthy();
      })
      .finally(()=>done());
    });
  });
  describe('POST data', function() {
    let opts;
    beforeEach(function() {
      opts = testOptions;
      opts.method = 'POST';
      opts.body = JSON.stringify(testData2);
      fetch = AbortableFetch(testUrl, opts);
    });
    afterEach(function(fixed) {
      opts = testOptions;
      opts.method = 'POST';
      opts.body = JSON.stringify(testData1);
      fetch = AbortableFetch(testUrl, opts);
      fetch.request.then(()=>fixed()).catch((error)=>{throw error;});
    });
    it('should update data and echo it updated', function(done) {
      fetch.request
      .then((data)=>{
        expect(data).toEqual(JSON.parse(opts.body));
      })
      .finally(()=>done());
    });
  });
});
