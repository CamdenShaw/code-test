const LineAnalyser = require("../index.js")
// const data = require("../data/mylogfile.log")

describe("A line analyser that creates an object that analyses line separated text files.", () => {
    test.lineAnalyser = new LineAnalyser()
    describe("When a text file is inserted", () => {
        it("Should read the file.", () => {
            expect(test.lineAnalyser._read().toEqual())
        })
        it("Should return the elapsed time in milliseconds", () => {
            expect(test.lineAnalyser._write()["time"].toBe())
        })
    })
    describe("bytes", () => {
        it("Should return the length of file in bytes", () => {
            expect(test.lineAnalyser._write()["size"].toBe())
        })
    })
    describe("number of lines", () => {
        it("Should return a line count", () => {
            expect(test.lineAnalyser._write()["lines"].toBe())
        })
    })
})
