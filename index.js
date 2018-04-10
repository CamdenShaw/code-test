const net = require("net"),
    fs = require("fs"),
    LineAnalyser = require("./src/LineAnalyser"),
    spiel = fs.readFileSync("./data/mylogfile.txt", "utf8"),
    server = net.createServer()

let remoteAddress, conn

server.on("connection", handleConnection)

server.listen(9000, () => {
    console.log("server listening to %j", server.address())
})

function handleData(data) {
    console.log(
        `${remoteAddress ? remoteAddress : "Server"} has loaded data: "${data}"`,
        typeof data
    )
    conn &&
        conn.write(
            `Received message: ${data.trim()}\n Let me make sure you read that: ${data
                .toUpperCase()
                .trim()}\n`
        )
    dataAnalysis = new LineAnalyser(data)
    dataAnalysis._read()
    dataAnalysis._write()
    console.log(dataAnalysis)
}

handleData(spiel)

function handleConnection(conn) {
    remoteAddress = `${conn.remoteAddress}: ${conn.remotePort}`
    console.log(`new client connection from ${remoteAddress}`)

    conn.setEncoding("utf8")

    function handleClose() {
        console.log(`${remoteAddress} has closed`)
    }

    function handleError(e) {
        console.log(`${remoteAddress} has experienced an error: ${e.message}`)
    }

    conn.on("close", handleClose)
    conn.on("error", handleError)
    conn.on("data", handleData)
}
