const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set("view engine", "ejs")

app.use("/face", require("./routes/face/enroll"))
app.use("/face", require("./routes/face/profile"))
app.use("/speech", require("./routes/speech/enroll"))
app.use("/speech", require("./routes/speech/profile"))

app.listen(3000, () => {
    console.log("Server started at port 3000")
})
