const STATUS_CODES = require('http').STATUS_CODES

class ErrDrop extends Error {
	constructor(message, status) {
    if (!message && status && STATUS_CODES[status]) {
      message = STATUS_CODES[status]
    }

		super(message)
		this.status = status
  }

  send(res) {
    res.status(this.status || 500).send(this.message)
    return this
  }

  log() {
    console.log(this)
    return this
  }
}

for (let [status, name] of Object.entries(STATUS_CODES)) {
  name = name.replace(/[^A-Za-z]/g, '')

  ErrDrop[name] = class extends ErrDrop {
    constructor(message) {
      super(message, status)
    }
  }
}

// convenience aliases
ErrDrop.Ok       = ErrDrop.OK
ErrDrop.Internal = ErrDrop.InternalServerError

module.exports = ErrDrop