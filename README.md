# The Local Storage Bridge

1K library for exchanging messages between tabs in a same browser. It uses the local storage as a communication channel.

## Usage

Add **lsbridge.min.js** to your page:

```html
<script src="js/lsbridge.min.js"></script>
```

There is a global object `lsbridge` available.

Send messages:

```js
lsbridge.send('my-namespace', { message: 'Hello world!' });
```

Listen for messages:

```js
lsbridge.subscribe('my-namespace', function(data) {
  console.log(data); // prints: { message: 'Hello world!'}
});
```

Find out if `localStorage` is available:

```js
console.log(lsbridge.isLSAvailable); // prints "true" or "false"
```

## Compilation

* Run `npm install` to get UglifyJS installed.
* Run `npm run-script compile` to produce `build/jsbridge.min.js`

## Example

Try it yourself by opening `example/index.html` in a browser.

![lsbridge](http://work.krasimirtsonev.com/git/lsbridge/lsbridge.gif)
