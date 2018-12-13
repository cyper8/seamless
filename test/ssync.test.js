import { SeamlessSync } from '../src/ssync.js';

let baseroot, input;

var test_array = [{
  "_id": "100000000000000000000000",
  "type": "greeting",
  "count": 1,
  "hoverable": false,
  "message": "Hello!",
  "addresee": "Bob"
},
{
  "_id": "100000000000000000000001",
  "type": "introduction",
  "count": 1,
  "hoverable": true,
  "message": "I'm Seamless",
  "addresee": "Bob"
},
{
  "_id": "100000000000000000000002",
  "type": "message",
  "count": 3,
  "hoverable": true,
  "message": "I've been waiting for you",
  "addresee": "Bob"
},
{
  "_id": "100000000000000000000003",
  "type": "writeoff",
  "count": 1,
  "hoverable": false,
  "message": "So long!",
  "addresee": "Bob"
}];

var test_single = {
  "_id": "100000000000000000000002",
  "string": "message",
  "number": 3,
  "boolean": true,
  "object": {
    "array": [
      "I've been waiting for you",
      "Call me back",
      "someday"
    ]
  },
  "input": "Bye"
};

describe("SeamlessSync function must be bound to an element and", function(){
  beforeAll(function(){
    baseroot = document.createElement('div');
    document.body.appendChild(baseroot);
    baseroot.innerHTML = `
    <input id="input" />`;
    input = document.getElementById('input');
    baseroot.seamless = SeamlessSync.bind(baseroot);
  });
  describe("create all sorts of html children such as", function(){
    beforeAll(function(){
      baseroot.seamless(test_single);
    });
    afterAll(function(){
      baseroot.innerHTML = "";
    });
    it("should create \"_id\" as an attribute", function(){
      expect(baseroot.hasAttribute("_id")).toBeTruthy();
      expect(baseroot.getAttribute("_id")).toEqual(test_single._id);
    });
    it("should create boolean data properties as element attributes", function(){
      expect(baseroot.hasAttribute("boolean")).toBeTruthy();
      expect(baseroot.getAttribute("boolean")).toEqual(test_single.boolean.toString());
    });
    it("should create (or use existant) children for other types", function(){
      let key;
      for (key in test_single) {
        switch(typeof test_single[key]) {
          case "number":
          case "string":
          case "object":
            if (key !== "_id") {
              let field_child = baseroot.querySelector("#"+key);
              expect(field_child).not.toBeNull();
            }
            break;
          default:
        }
      }
    });
    it('should fire seamlessdatachange event on used input children upon change', function(done) {
      const new_value = 'Hello';
      baseroot.addEventListener('seamlessdatachange', (e)=>{
        expect(e.target).toBe(input);
        expect(test_single.input).toEqual(new_value);
        done();
      });
      input.value = new_value;
      input.dispatchEvent(
        new Event('change')
      );
    });
  });
});
