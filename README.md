# errdrop

A lightweight drop-in `Error` replacement with take-it-or-leave-it HTTP status code support.

Useful for preserving associations between errors and their appropriate HTTP status codes when decoupling application logic from middleware plumbing.


## Installation
```bash
# npm
npm i --save errdrop

# yarn
yarn add errdrop
```


## Example
```js
const Error = require('errdrop')

// Good practice to decouple application logic
// from middleware plumbing (req/res)
function doSomething(options) {
  if (!options.id) {
    throw Error.BadRequest('missing id')
  }

  return 'done'
}

app.get('/', (req, res) => {
  try {
    const result = doSomething(req.query)
    res.send(result)
  }
  catch (err) {
    res.status(err.status || 500).send(err.message)
  }
})
```