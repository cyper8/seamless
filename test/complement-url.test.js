import { ComplementUrl } from '../src/utils/complement-url.js';

describe('\"ComplementUrl\" function', function(){
  it("should return string", function(){
    let url = ComplementUrl("https:///some/end/point");
    expect(typeof url === "string").toBeTruthy();
  });
  it('should return valid url', function(){
    let valid = ComplementUrl('wss://example.com/some/end/point');
    expect(function(){
      return new URL(valid);
    }).not.toThrow();
  });
});
