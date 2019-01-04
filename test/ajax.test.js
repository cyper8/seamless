import { ajax } from '../src/ajax.js';

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

describe('Ajax', function() {
  describe('GET request', function() {
    beforeEach(function() {
      fetch = ajax(testUrl,testOptions);
    });
    it('should eventually get test data', function(done) {
      fetch.request.then((data) => {
        expect(data).toEqual(testData1);
      })
      .catch(console.error)
      .finally(()=>done());
    });
    it('should be able to be aborted', function() {
      fetch.abort();
      expectAsync(fetch.request).toBeRejected();
    });
  });
  describe('POST request', function() {
    let opts;
    beforeEach(function() {
      opts = testOptions;
      opts.method = 'POST';
      opts.body = JSON.stringify(testData2);
      fetch = ajax(testUrl, opts);
    });
    afterEach(function(fixed) {
      opts = testOptions;
      opts.method = 'POST';
      opts.body = JSON.stringify(testData1);
      fetch = ajax(testUrl, opts);
      fetch.request.then(()=>fixed()).catch((error)=>{throw error;});
    });
    it('should update data and echo it updated', function(done) {
      fetch.request
      .then((data)=>{
        expect(data).toEqual(JSON.parse(opts.body));
      })
      .catch(console.error)
      .finally(()=>done());
    });
  });
});
