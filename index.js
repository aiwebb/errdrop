class ErrDrop extends Error {
	constructor(message, status) {
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

for (let [status, name] of Object.entries(require('http').STATUS_CODES)) {
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