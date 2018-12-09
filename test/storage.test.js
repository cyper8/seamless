import { storage } from '../src/storage.js';

let store, storageEventSpy;
let testgen;
let __window = window;

function TestFor(k) {
  let _ov;
  return function(v) {
    let o = {
      key: k,
      newValue: v
    };
    if (_ov) {
      o.oldValue = _ov;
    }
    _ov = v;
    return o;
  };
}

beforeAll(function() {
  store = storage();
  store.clear();
});

describe('Storage', function() {

  it('can be written to by key-value pairs', function(){
    store.setItem('testkey', 'testvalue');
    expect(store.getItem('testkey')).toEqual('testvalue');
  });

  it('value can be subsequently overwritten', function(){
    store.setItem('testkey', 'testvalue2');
    expect(store.getItem('testkey')).toEqual('testvalue2');
  });

  it('value can be removed', function() {
    store.removeItem('testkey');
    expect(store.getItem('testkey')).toBeNull();
  });
  // NOT FUNCTIONAL SINCE EVENT IS FIRED ON BLURRED WINDOWS WITH ACCESS TO
  // THE SAME STORAGE
  //
  // describe('once',function(){
  //   beforeAll(function(){
  //     store.clear();
  //     storageEventSpy = jasmine.createSpy('storageEvent');
  //     __window.addEventListener('storage', storageEventSpy);
  //     __window.blur();
  //     testgen = TestFor('testkey');
  //   });
  //   describe('initially set',function(){
  //     beforeAll(function(){
  //       store.setItem('testkey', 'testvalue');
  //     });
  //     it('should trigger a storage event on window with oldValue undefined', function(){
  //       expect(storageEventSpy).toHaveBeenCalledTimes(1);
  //     });
  //   });
  //   describe('changed',function(){
  //     beforeAll(function(){
  //       store.setItem('testkey', 'testvalue2');
  //     });
  //     it('should trigger storage event on window with respective oldValue and neValue', function(){
  //       expect(storageEventSpy).toHaveBeenCalledTimes(1);
  //     });
  //   });
  //   describe('removed',function(){
  //     beforeAll(function(){
  //       store.removeItem('testkey');
  //     });
  //     it('should trigger storage event on window with newValue undefined', function(){
  //       expect(storageEventSpy).toHaveBeenCalledTimes(1);
  //     });
  //   });
  // });
});
