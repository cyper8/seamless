# Seamless

A data-binding client-side framework intended to _seamlessly_ sync and parse data between web page and a server endpoint as follows:

Say, you have a server that responds to `GET`s with JSON object

```json
{ "_id":123, "foo":"bar", "baz":2, "boo":true }
```

and either saves `POST`s to it.

>Note: Although it is better to use `ws://` or `wss://` endpoints for they are supported too.

#### from Javascript

Add `script` tag pointing to `bin/seamless-client.js` and write JS code:

```javascript
Seamless
  .connect('https://your.endpoint/here')
  .bindClients([some,element,reference,and_some_js_object]);
```

And you will get following HTML structure on page:

```html
<!--  element, referenced by "some" var //-->
<div _id="123" boo="true">
  <div id="foo">
    bar
  </div>
  <div id="baz">
    2
  </div>
</div>

 . . . .

<!--  element, referenced by "element" var //-->
<div _id="123" boo="true">
  <div id="foo">
    bar
  </div>
  <div id="baz">
    2
  </div>
</div>

 . . . .
 
<!--  element, referenced by "reference" var //-->
<div _id="123" boo="true">
  <div id="foo">
    bar
  </div>
  <div id="baz">
    2
  </div>
</div>

```

Also your `and_some_js_object` will have `status` getter and setter to your remote data.

>It is intended for use with Polymer components.

#### from HTML

Or you can hardcode it into your templates:

```html
<body>
  <div data-seamless="https://your.endpoint/here"></div>
  
 . . . .
 
</body>
```

And, in the end:

```javascript
window.addEventListener('load',function(){
  Seamless.compile(document.body);
});
```

The result will be:

```html
<body>
  <div data-seamless="https://your.endpoint/here" _id="123" boo="true">
    <div id="foo">
      bar
    </div>
    <div id="baz">
      2
    </div>
  </div>
  
 . . . .
 
</body>
```

#### from both

HTML:

```html
<body>
  <div data-sync="CustomSync" data-seamless="https://your.endpoint/here"></div>
  
 . . . .
 
</body>
```

Javascript:
```javascript
function CustomSync(data,transmitter){
  /*
  * parsing data
  * this = element with corresponding data-sync attribute
  */
  this.innerText = JSON.stringify(data);
  
  /*
  * when called first time, this function has a callback as 2-nd argument
  * to be used for data uploading. It is wise to bind it to some user actions
  */
  if (transmitter) {
    this.addEventListener('click',function(e){
        // "baz" field decrement upon a click on the element
      if (data.baz>0) data.baz--;
        // save the changes to the server
      transmitter(data);
    });
    this.addEventListener('contextmenu',function(e){
        // logical inversion of "boo" field on right mouse button
      data.boo = !data.boo;
      e.preventDefault(); // don't show a context menu
        // save the changes to the server
      transmitter(data);
    })
  }
}

window.addEventListener('load',function(){
  Seamless.compile(document.body);
});
```

Result is a pokeable HTML:


```html
<body>
  <div data-sync="CustomSync" data-seamless="https://your.endpoint/here">
      { "_id":123, "foo":"bar", "baz":1, "boo":false }
  </div>
  
 . . . .
 
</body>
```