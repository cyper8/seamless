import { Debounced } from '../src/utils/debounced.js';

const TESTTIMEOUT = 100;
let teststart;
let spiednow;

describe("\"Debounced\" function", function(){
  it("should return a function", function(){
    let debounced = Debounced(function(){}, TESTTIMEOUT);
    expect(typeof debounced === "function").toBeTruthy();
  });

  describe("which is once called", function(){
    it("should execute target function after specified timeout", function(done){
      let debounced = Debounced(function(){
        expect(Date.now()-teststart).toBeCloseTo(TESTTIMEOUT,-1);
        done();
      }, TESTTIMEOUT);
      teststart = Date.now();
      debounced();
    });
  });

  describe("which is once recalled", function(){
    beforeAll(function(){
      spiednow = jasmine.createSpy("debounced_test_func", Date.now)
      .and.callThrough();
    });
    afterAll(function(){
      expect(spiednow).toHaveBeenCalledTimes(1);
    });
    it("should reset unfinished timer of the previous invocation", function(done){
      let debounced = Debounced(function(){
        expect(spiednow()-teststart).toBeCloseTo(TESTTIMEOUT,-1);
        done();
      }, TESTTIMEOUT);
      function TestRun(){
        teststart = Date.now();
        debounced();
      }
      TestRun();
      TestRun();
      TestRun();
    });
    it("should be called only once after all", function(){
      // expect(spiednow).toHaveBeenCalledTimes(1);
    });
  });
});
