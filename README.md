# errdrop

A lightweight drop-in `Error` replacement with take-it-or-leave-it HTTP status code support.

Useful for preserving associations between errors and their appropriate HTTP status codes when decoupling application logic from middleware plumbing.

## Installation
```bash
# npm
npm i errdrop

# yarn
yarn add errdrop
```

## Example
```js
const Error = require('errdrop')

// Good practice to decouple application logic
// from middleware plumbing (req/res)
function sayHello(name) {
  switch (name) {
    case 'Dwight':
      throw new Error.Forbidden(`Go away, ${name}.`)

    case 'Michael':
      throw new Error.MovedPermanently()

    default:
      return `Hello, ${name}!`
  }
}

app.get('/say-hello/:name', (req, res) => {
  try {
    res.send(sayHello(req.params.name))
  }
  catch (err) {
    res.status(err.statusCode || 500).send(err.message)
  }
})
```

## Supported status codes

Subclasses are generated for each entry in `http.STATUS_CODES`. See [here](https://runkit.com/aiwebb/errdrop-helper-classes) for the full list.

These classes pass all arguments through to `Error` for full drop-in compatibility.

Custom or [nonstandard](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes) status codes are supported via the generic `Error.StatusCode` class, which prepends the `Error` class signature with a status code parameter:

```js
throw new Error.StatusCode(218, 'This is fine')
```

## `thinware` support

This module pairs well with [thinware](https://github.com/aiwebb/thinware), which honors status codes attached to thrown `Error` objects:

```js
/*
  /say-hello/Dwight   =>  403 Forbidden          "Go away, Dwight."
  /say-hello/Michael  =>  301 Moved Permanently  "Moved Permanently"
  /say-hello/Pam      =>  200 OK                 "Hello, Pam!"
*/
app.get('/say-hello/:name',
  thinware(sayHello, req => req.params.name)
)
```