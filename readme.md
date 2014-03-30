Resizer
=======

now you can do nifty things like:
```js
new ResizerManager(document.getElementsByClassName('resizer'));
new Resizer(document.getElementById('resizer'), {"maxFontSize": 14});
```
etc.

it also reads data attributes:
```html
<input style="textbox" class="resizer" placeholder="look at me" data-resizer='{"minFontSize": 8}'>
```

---
**try this at home**
 * clone this project
 * open index.html in your browser of choice
