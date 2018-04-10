const { Duplex } = require("stream"),
    dataSource = Symbol("source"),
    fs = require("fs")

class LineAnalyser extends Duplex {
    constructor(source, options) {
        super(options)
        this[dataSource] = source
        this.readArr = []
        this.timer = setInterval(this.addTime, 1000, this.readArr)
        this.calcArrRead = []
        this.calcArrWrite = []
        this.readObj = {}
        this.writeObj = {}
        this.readCount = 0
        this.writeCount = 0
    }

    addTime(readArr) {
        readArr.push(new Date().toString())
    }

    calcTime(text = "", calcArr = []) {
        let x = new Date().getTime()
        calcArr.push(x)
        if (calcArr.length === 2) {
            let y = calcArr[1] - calcArr[0]
            console.log(`${text} time: `, y)
            return y
        }
    }

    writeStuff(chunk = "") {
        if (chunk === "") return
        this.calcArrWrite = []
        this.calcTime("write", this.calcArrWrite)
        console.log("write: ", chunk)
        this.writeObj[this.writeCount] = {
            length: `${Buffer.byteLength(chunk, "utf8")} bytes`,
            time: `${this.calcTime("write", this.calcArrWrite)} ms`
        }
        console.log(this.writeObj)
        fs.appendFile(
            "data/LogObject.log",
            `{"${this.writeCount}":` +
                JSON.stringify(this.writeObj[this.writeCount]) +
                "}\n",
            "utf8",
            err => {
                if (err) throw err
                else console.log("object saved")
            }
        )
        this.writeCount++
    }

    _write(chunk = this[dataSource], encoding, callback) {
        if (typeof chunk !== "") {
            console.log("type of string")
            chunk = chunk.toString()
        }
        fs.appendFile("data/mylogfile.log", chunk, err => {
            if (err) throw err
        })
        chunk = chunk.split("\n")
        if (typeof chunk !== "") {
            chunk.forEach(hunk => this.writeStuff(hunk))
        } else this.writeStuff(chunk)
        fs.appendFile(
            "data/LogObject.log",
            `{"Total Line Count:${this.writeCount}"}\n`,
            "utf8",
            err => {
                if (err) throw err
                else console.log("object saved")
            }
        )
        callback()
    }

    _read(n = this[dataSource]) {
        console.log(this.readCount)
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
        this.readObj[this.readCount] = {}
        this.readObj[this.readCount]["read time"] = `${this.calcTime(
            "read",
            this.calcArrRead
        )} ms`

        console.log(this.readObj)
        this.readCount++
        console.log(this.readCount)
    }

    stopTimer() {
        if (this.timer) clearInterval(this.timer)
        this.timer = null
    }
}

module.exports = LineAnalyser
