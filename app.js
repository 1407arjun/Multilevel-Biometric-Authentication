const express = require("express")
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient

const app = express()
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use(bodyParser.json({ limit: "50mb" }))

require("dotenv").config()

const client = new MongoClient(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/user", async (req, res) => {
    await client.connect()
    const user = await client
        .db("MBA")
        .collection("profiles")
        .findOne({ username: req.query.username })
    await client.close()
    res.json(user)
})

app.post("/user", async (req, res) => {
    await client.connect()
    const response = await client.db("MBA").collection("profiles").insertOne({
        username: req.body.username,
        name: req.body.name,
        face: req.body.face,
        profileId: req.body.profileId
    })
    await client.close()
    res.json(response)
})

app.post("/", (req, res) => {
    console.log(req.body)
    res.send({ res: "Ok" })
})

app.listen(3000, () => {
    console.log("Server started at port 3000")
})
