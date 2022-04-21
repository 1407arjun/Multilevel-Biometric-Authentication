const webCamContainer = document.getElementById("web-cam-container")
const canvas = document.querySelector("canvas")

var thingsToRead = [
    "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser. Consequently, Node.js represents a JavaScript everywhere paradigm, unifying web-application development around a single programming language, rather than different languages for server-side and client-side scripts.",
    "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript."
]

let chunks = []
let paused = true
let timer
let dataURL
let faceId1

const videoMediaConstraints = {
    audio: true,
    video: true
}

function startRecording(thisButton, otherButton) {
    if (document.querySelector("audio"))
        document
            .querySelector("audio")
            .parentElement.removeChild(document.querySelector("audio"))
    if (document.getElementById("download"))
        document
            .getElementById("download")
            .parentElement.removeChild(document.getElementById("download"))
    if (document.querySelector("canvas"))
        document
            .querySelector("canvas")
            .parentElement.removeChild(document.querySelector("canvas"))

    document.getElementById("screenshot").src = ""

    paused = true
    navigator.mediaDevices
        .getUserMedia(videoMediaConstraints)
        .then((mediaStream) => {
            const mediaRecorder = new MediaRecorder(mediaStream)
            window.mediaStream = mediaStream
            window.mediaRecorder = mediaRecorder

            document.getElementById("things-to-read").innerText =
                "Maybe read this: \n" +
                thingsToRead[Math.floor(Math.random() * thingsToRead.length)]

            mediaRecorder.start()
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }

            mediaRecorder.onstop = () => {
                if (!paused) {
                    const blob = new Blob(chunks, {
                        type: "audio/wav; codecs=audio/pcm"
                    })
                    chunks = []

                    const recordedMedia = document.createElement("audio")
                    recordedMedia.controls = true
                    const recordedMediaURL = URL.createObjectURL(blob)
                    recordedMedia.src = recordedMediaURL
                    createTextIndependentVerificationProfile(blob)
                }
            }
            webCamContainer.srcObject = mediaStream
            thisButton.disabled = true
            otherButton.disabled = false

            let time = 25
            let click = 25 - Math.floor(Math.random() * 20)
            console.log(click)
            timer = setInterval(() => {
                time--
                document.getElementById(
                    "timer"
                ).innerText = `${time} sec(s) remaining`
                if (time == click) {
                    canvas.width = webCamContainer.videoWidth
                    canvas.height = webCamContainer.videoHeight
                    console.log("Hee")
                    canvas
                        .getContext("2d")
                        .drawImage(
                            webCamContainer,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        )

                    dataURL = canvas.toDataURL()
                    console.log(dataURL)
                    document.getElementById("screenshot").src = dataURL
                }
                if (time <= 0) {
                    paused = false
                    stopRecording(
                        document.getElementById("stop-vid-recording"),
                        document.getElementById("start-vid-recording")
                    )
                }
            }, 1000)
        })
}

function stopRecording(thisButton, otherButton) {
    window.mediaRecorder.stop()
    window.mediaStream.getTracks().forEach((track) => {
        track.stop()
    })

    document.getElementById("timer").innerText = `25 sec(s) remaining`
    thisButton.disabled = true
    otherButton.disabled = false

    clearInterval(timer)
}

function verify() {
    paused = true
    navigator.mediaDevices
        .getUserMedia(videoMediaConstraints)
        .then((mediaStream) => {
            const mediaRecorder = new MediaRecorder(mediaStream)
            window.mediaStream = mediaStream
            window.mediaRecorder = mediaRecorder

            mediaRecorder.start()
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }

            mediaRecorder.onstop = () => {
                if (!paused) {
                    const blob = new Blob(chunks, {
                        type: "audio/wav; codecs=audio/pcm"
                    })
                    chunks = []

                    const recordedMedia = document.createElement("audio")
                    recordedMedia.controls = true
                    const recordedMediaURL = URL.createObjectURL(blob)
                    recordedMedia.src = recordedMediaURL
                    verifyTextIndependentProfile(blob)
                }
            }

            webCamContainer.srcObject = mediaStream
            document.getElementById("timer").innerText = `6 sec(s) remaining`

            let time = 6
            let click = Math.floor(Math.random() * 5)
            timer = setInterval(() => {
                time--
                document.getElementById(
                    "timer"
                ).innerText = `${time} sec(s) remaining`
                if (time == click) {
                    canvas.width = webCamContainer.videoWidth
                    canvas.height = webCamContainer.videoHeight
                    console.log("Hee")
                    canvas
                        .getContext("2d")
                        .drawImage(
                            webCamContainer,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        )

                    dataURL = canvas.toDataURL()
                    console.log(dataURL)
                    document.getElementById("screenshot").src = dataURL
                    startFaceDetection(dataURL, 2)
                }

                if (time <= 0) {
                    paused = false
                    window.mediaRecorder.stop()
                    window.mediaStream.getTracks().forEach((track) => {
                        track.stop()
                    })
                    clearInterval(timer)
                }
            }, 1000)
        })
}

function createUser() {
    var request = new XMLHttpRequest()
    request.open("POST", "/user", true)
    request.setRequestHeader("Content-Type", "application/json")

    request.onload = function () {
        const json = JSON.parse(request.responseText)
        if (json.acknowledged) alert("User registered successfully")
        else alert("Failed to register user")
    }

    request.send(
        JSON.stringify({
            name:
                document.getElementById("firstName").value +
                " " +
                document.getElementById("lastName").value,
            username: document.getElementById("username").value,
            profileId,
            face: dataURL
        })
    )
}
