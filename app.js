const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/face", require("./routes/face/enroll"))
app.use("/face", require("./routes/face/profile"))
app.use("/speech", require("./routes/speech/enroll"))
app.use("/speech", require("./routes/speech/profile"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(3000, () => {
    console.log("Server started at port 3000")
})
