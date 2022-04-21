const webCamContainer = document.getElementById("web-cam-container")
const canvas = document.querySelector("canvas")

var thingsToRead = [
    "Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you",
    "There's a voice that keeps on calling me\n	Down the road, that's where I'll always be.\n	Every stop I make, I make a new friend,\n	Can't stay for long, just turn around and I'm gone again\n	\n	Maybe tomorrow, I'll want to settle down,\n	Until tomorrow, I'll just keep moving on.\n	\n	Down this road that never seems to end,\n	Where new adventure lies just around the bend.\n	So if you want to join me for a while,\n	Just grab your hat, come travel light, that's hobo style.",
    "They're the world's most fearsome fighting team \n	They're heroes in a half-shell and they're green\n	When the evil Shredder attacks\n	These Turtle boys don't cut him no slack! \n	Teenage Mutant Ninja Turtles\nTeenage Mutant Ninja Turtles",
    "If you're seein' things runnin' thru your head \n	Who can you call (ghostbusters)\n	An' invisible man sleepin' in your bed \n	Oh who ya gonna call (ghostbusters) \nI ain't afraid a no ghost \n	I ain't afraid a no ghost \n	Who ya gonna call (ghostbusters) \n	If you're all alone pick up the phone \n	An call (ghostbusters)"
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
