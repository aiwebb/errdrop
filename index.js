const STATUS_CODES = require('http').STATUS_CODES

// Core class
class ErrDrop extends Error {
  send(res) {
    res.status(this.statusCode || 500).send(this.message)
    return this
  }

  log() {
    console.log(this)
    return this
  }

  // Aliases for statusCode
  get status() {return this.statusCode}
  get code()   {return this.statusCode}
}

// Subclasses for each status code
for (let [statusCode, description] of Object.entries(STATUS_CODES)) {
  let name = description.replace(/[^A-Za-z]/g, '')

  ErrDrop[name] = {
    // Use dynamic key evaluation to force the anonymous class
    //  to have the correct constructor.name on instances -
    //  ErrDrop[name] = class ... => constructor.name === 'ErrDrop'
    //  ErrDrop[name] = {[name]: class ...}[name] => constructor.name === name
    [name]: class extends ErrDrop {
      constructor(message, ...args) {
        super(message, ...args)
        this.statusCode  = statusCode
        this.description = description
        this.message     = this.message || this.description
      }
    }
  }[name]
}

// Subclass for custom HTTP status codes
ErrDrop.StatusCode = class extends ErrDrop {
  constructor(statusCode, ...args) {
    super(...args)

    this.statusCode  = statusCode
    this.description = STATUS_CODES[this.statusCode] || this.message
  }
}

// Convenience aliases
ErrDrop.Ok       = ErrDrop.OK
ErrDrop.Internal = ErrDrop.InternalServerError

module.exports = ErrDrop