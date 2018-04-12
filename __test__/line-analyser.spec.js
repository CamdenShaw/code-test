/*
 *  originally written based on the "jest" dependency, then rewritten to try to recreate the tests jest supplies.
*/

const fs = require("fs"),
    data = fs.readFileSync("./data/mylogfile.txt", "utf8"),
    LineAnalyser = require("../src/LineAnalyser.js")

lineAnalyser = new LineAnalyser(data)

const expect = (par1, par2) => {
    if (par1 === par2) console.log("success")
    else console.log("FAIL")
}

const it = (text, func) => {
    console.log("it", text)
    // func()
}

const describe = (text, ...funcs) => {
    console.log("describe", text)
    // if (isObject) funcs.forEach(fun => fun())
    // else return funcs
}

describe(
    "A line analyser that creates an object that analyses line separated text files.",
    describe(
        "When a text file is inserted",
        it("Should read the file.", expect(typeof lineAnalyser._read(), "")),
        it(
            "Should return the elapsed time in milliseconds",
            expect(typeof lineAnalyser._write(), Date)
        )
    ),
    describe(
        "bytes",
        it(
            "Should return the length of file in bytes",
            expect(typeof lineAnalyser._write(), String)
        )
    ),
    describe(
        "number of lines",
        it("Should return a line count", expect(lineAnalyser._write(), Number))
    )
)
