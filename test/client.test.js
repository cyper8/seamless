import { SeamlessClient } from '../src/client.js';

function testFunction() {
  console.log(`test function called with: `, ...arguments);
}
//
// function alternativeSyncFunction(data, transmitter) {
//   console.log(`test function called with: `, ...arguments);
// }
let testFuncSpy;
let testElement;
let testObject = {};
let client, client1, client2;
let testTransmit = jasmine.createSpy('transmission_spy');
let testData = {
  a: 1,
  b: '2',
  c: true,
  d: {
    e: 'f'
  }
};

describe('SeamlessClient instance', function() {
  describe('if it wraps HTMLElement', function() {
    describe('that has no custom sync function it', function() {
      beforeEach(function() {
        testElement = document.createElement('div');
        document.body.appendChild(testElement);
        client = new SeamlessClient(testElement, testTransmit, testData);
      });
      afterEach(function() {
        client.deseamless();
        document.body.removeChild(testElement);
        testElement = undefined;
        client = undefined;
      });
      it(`should define seamless function on it that is binded SeamlessSync
        and call it`,
        function() {
          expect(client.seamless).toBeDefined();
          expect(client.seamless.name).toMatch(/^bound/);
          expect(client.innerHTML).not.toBe('');
        }
      );
      it(`should define status setter that transmits changes and getter that
        returns current data`,
        function() {
          expect(client.status).toBeDefined();
          expect(client.status).toEqual(testData);
          client.status = {foo: 'bar'};
          expect(testTransmit).toHaveBeenCalledWith({foo: 'bar'});
        }
      );
      it('should define deseamless function that destroys previous defines', function() {
        client.deseamless();
        expect(client.seamless).not.toBeDefined();
        expect(client.status).not.toBeDefined();
      });
    });
    describe('that has custom sync function it', function() {
      beforeEach(function() {
        testElement = document.createElement('div');
        document.body.appendChild(testElement);
        window.alternativeSyncFunction = jasmine.createSpy('altSync_spy', testFunction)
        .and.callThrough();
        testElement.dataset.sync = 'alternativeSyncFunction';
        client = new SeamlessClient(testElement, testTransmit, testData);
      });
      afterEach(function() {
        client.deseamless();
        document.body.removeChild(testElement);
        testElement = undefined;
        client = undefined;
        delete window.alternativeSyncFunction;
      });
      it(`should define seamless function that is bound custom sync function
        and call it with data`,
        function() {
          expect(client.seamless).toBeDefined();
          expect(client.seamless.name).toMatch(/^bound/);
          expect(window.alternativeSyncFunction).toHaveBeenCalledWith(testData);
        }
      );
      it(`should define status setter that transmits changes and getter that
        returns current data`,
        function() {
          expect(client.status).toBeDefined();
          expect(client.status).toEqual(testData);
          client.status = {foo: 'bar'};
          expect(testTransmit).toHaveBeenCalledWith({foo: 'bar'});
        }
      );
      it('should define deseamless function that destroys previous defines', function() {
        client.deseamless();
        expect(client.seamless).not.toBeDefined();
        expect(client.status).not.toBeDefined();
      });
    });
  });
  describe('if it wraps Function it', function() {
    beforeEach(function() {
      testFuncSpy = jasmine.createSpy('testFuncSpy', testFunction)
      .and.callThrough();
      client = new SeamlessClient(testFuncSpy, testTransmit, testData);
    });
    afterEach(function() {
      client.deseamless();
      client = undefined;
      testFuncSpy = undefined;
    });
    it('should define seamless on it as a bound version of itself and call it',
      function() {
        expect(client.seamless).toBeDefined();
        expect(client.seamless.name).toMatch(/^bound/);
        expect(testFuncSpy).toHaveBeenCalledWith(testData);
      }
    );
    it(`should define status setter that transmits changes and getter that
      returns current data`,
      function() {
        expect(client.status).toBeDefined();
        expect(client.status).toEqual(testData);
        client.status = {foo: 'bar'};
        expect(testTransmit).toHaveBeenCalledWith({foo: 'bar'});
      }
    );
    it('should define deseamless function that destroys previous defines', function() {
      client.deseamless();
      expect(client.seamless).not.toBeDefined();
      expect(client.status).not.toBeDefined();
    });
  });
  describe('if it wraps Object it', function() {
    beforeEach(function() {
      client = new SeamlessClient(testObject, testTransmit, testData);
    });
    afterEach(function() {
      client.deseamless();
      client = undefined;
    });
    it('should assign seamless as "false"', function() {
      expect(client.seamless).toBeDefined();
      expect(client.seamless).toBe(false);
    });
    it(`should define status setter that transmits changes and getter that
      returns current data`,
      function() {
        expect(client.status).toBeDefined();
        expect(client.status).toEqual(testData);
        client.status = {foo: 'bar'};
        expect(testTransmit).toHaveBeenCalledWith({foo: 'bar'});
      }
    );
    it('should define deseamless function that destroys previous defines', function() {
      client.deseamless();
      expect(client.seamless).not.toBeDefined();
      expect(client.status).not.toBeDefined();
    });
  });
});
