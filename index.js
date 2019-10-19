class StatusError extends Error {
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
  name = name.replace(/^[A-Za-z]/g, '')
  StatusError.prototype[name] = message => new StatusError(message, status)
}

// convenience aliases
StatusError.Ok       = StatusError.OK
StatusError.Internal = StatusError.InternalServerError

module.exports = StatusError