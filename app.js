const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true, limit: "1gb" }))
app.use(bodyParser.json({ limit: "1gb" }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    console.log(req.body)
    res.send({ res: "Ok" })
})

app.listen(3000, () => {
    console.log("Server started at port 3000")
})
