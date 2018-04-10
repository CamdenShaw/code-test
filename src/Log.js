const { Duplex } = require("stream"),
    dataSource = Symbol("source"),
    fs = require("fs")

class Logger extends Duplex {
    constructor(source, options) {
        super(options)
        this[dataSource] = source
    }

    _write(chunk = this[dataSource], encoding, callback) {
        callback()
    }

    _read(n = this[dataSource]) {
        this.calcArrRead = []
        this.calcTime("read", this.calcArrRead)
        let self = this
        while (this.readArr.length) {
            let chunk = this.readArr.shift()
            if (!self.push(chunk)) {
                break
            }
        }
        if (self.timer) setTimeout(this._read.bind(self), 1000, n)
        else self.push(null)
    }
}

module.exports = Logger
