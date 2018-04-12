/*
 * create a custom duplex stream for reading data and
 * generating log objects.
*/

const { Duplex } = require("stream"),
    dataSource = Symbol("source"),
    fs = require("fs")

/* created Custom Duplex class following instructions on code 
 * winds blog.  Updated what was on the blog to current es6 
 * model
 * http://codewinds.com/blog/2013-08-31-nodejs-duplex-streams.html#for_additional_reading
*/
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

    /* 
     * function for the timer function.  Didn't wind up using  
     * this in a constructive way.  Could delete.
    */
    addTime(readArr) {
        readArr.push(new Date().toString())
    }

    /* 
     * a function to calculate the start and stop of a read or 
     * write stream.
     * accepts text value for logging to console so node admin
     * can be confident it is working and Array for either the
     * read or write calculation
    */
    calcTime(text = "", calcArr = []) {
        /* grab new date in milliseconds */
        let x = new Date().getTime()
        /* push time to array */
        calcArr.push(x)
        /* 
         * on second time through, perform the calculation
        */
        if (calcArr.length === 2) {
            let y = calcArr[1] - calcArr[0]
            console.log(`${text} time: `, y)
            return y
        }
    }

    /* actual write function.  expect data chunk to be a string */
    writeStuff(chunk = "") {
        /* if chunk is not a string, exit function */
        if (chunk === "") return
        this.calcArrWrite = []
        /* call calcTime function for the first time */
        this.calcTime("write", this.calcArrWrite)
        /*
         * write chunk to the console so node admin can see 
         * the chunk currently being written 
        */
        console.log("write: ", chunk)
        /* create the log object */
        this.writeObj[this.writeCount] = {
            length: `${Buffer.byteLength(chunk, "utf8")} bytes`,
            /* call second calcTime function inside value assignment */
            time: `${this.calcTime("write", this.calcArrWrite)} ms`
        }
        /* let the node admin see the log object */
        console.log(this.writeObj)
        /* write the log object to the LogObject.log file */
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
        /* write line count increases by one */
        this.writeCount++
    }

    /* The pseudo write function that calls the actual write function */
    _write(chunk = this[dataSource], encoding, callback) {
        /* if data chunk is not a string, make it one */
        if (typeof chunk !== "") {
            console.log("type of string")
            chunk = chunk.toString()
        }
        /* write data chunk to the mylogfile.log */
        fs.appendFile("data/mylogfile.log", chunk, err => {
            if (err) throw err
        })
        /* break up the data chunk into smaller chunks by new lines */
        chunk = chunk.split("\n")
        /* 
         * if the data chunk had more than one "\n" it will be 
         * an array, if not it will be a string, so check what 
         * type of data we are dealing with at this point 
        */
        if (typeof chunk !== "") {
            /*
             * if data chunk is an array, split the chunks of 
             * data into hunks of data and write them
            */
            chunk.forEach(hunk => this.writeStuff(hunk))
        /* otherwise, just write the data chunk */
        } else this.writeStuff(chunk)
        /* write the line total to the LogObject.log file */
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

    /* read the data input */
    _read(n = this[dataSource]) {
        console.log(this.readCount)
        this.calcArrRead = []
        /* call the read calc time to start timer */
        this.calcTime("read", this.calcArrRead)
        let self = this
        /* create an array of data chunks */
        while (this.readArr.length) {
            let chunk = this.readArr.shift()
            if (!self.push(chunk)) {
                break
            }
        }
        /*
         * if timer is running, set timeout to bind 'self' to
         * 'this' every 1sec 
        */
        if (self.timer) setTimeout(this._read.bind(self), 1000, n)
        /* if not, push null to self to end read stream */
        else self.push(null)
        /* create read object for log */
        this.readObj[this.readCount] = {
            "read time": `${this.calcTime(
                "read",
                this.calcArrRead
            )} ms`
        }

        console.log(this.readObj)
        /* read line count increases by one */
        this.readCount++
        console.log(this.readCount)
    }

    /* create stop timer function */
    stopTimer() {
        if (this.timer) clearInterval(this.timer)
        this.timer = null
    }
}

/* export the file */
module.exports = LineAnalyser
