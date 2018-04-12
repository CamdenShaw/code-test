/*
 * This was going to be the stream that wrote a human readable 
 * log but I ran out of time to write it, as I passed the 
 * 24hrs allotted for the test as it was.
*/

const { Duplex } = require("stream"),
    dataSource = Symbol("source"),
    fs = require("fs")

/* Created Custom Duplex class following instructions on code 
 * winds blog.  Updated what was on the blog to current es6 
 * model
 * http://codewinds.com/blog/2013-08-31-nodejs-duplex-streams.html#for_additional_reading
*/
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
