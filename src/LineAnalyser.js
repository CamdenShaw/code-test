const Duplex = require("stream")
const dataSource = Symbol("source")

class LineAnalyser extends Duplex {
    constructor(source, options) {
        super(options)
        this[dataSource] = source
    }

    _write(chunk, encoding, callback) {
        console.log(chunk, encoding, callback)
    }

    _read(size) {
        console.log(size)
    }
}

module.exports = LineAnalyser
