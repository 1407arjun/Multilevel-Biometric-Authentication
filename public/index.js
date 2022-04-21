const webCamContainer = document.getElementById("web-cam-container")
const canvas = document.querySelector("canvas")

let chunks = []
let paused = true
let timer
let dataURL

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

            console.log(
                "I'm listening... just start talking for a few seconds..."
            )
            console.log(
                "Maybe read this: \n" +
                    thingsToRead[
                        Math.floor(Math.random() * thingsToRead.length)
                    ]
            )

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
            document.getElementById(`vid-record-status`).innerText = "Recording"
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
                    startFaceDetection(dataURL)
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

    document.getElementById(`vid-record-status`).innerText = "Recording done!"
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

            console.log(
                "I'm listening... just start talking for a few seconds..."
            )
            console.log(
                "Maybe read this: \n" +
                    thingsToRead[
                        Math.floor(Math.random() * thingsToRead.length)
                    ]
            )

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

            document.getElementById(`vid-record-status`).innerText = "Verifying"
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
                    startFaceDetection(dataURL)
                }

                if (time <= 0) {
                    paused = false
                    window.mediaRecorder.stop()
                    window.mediaStream.getTracks().forEach((track) => {
                        track.stop()
                    })
                    document.getElementById(`vid-record-status`).innerText =
                        "Verification done!"
                    clearInterval(timer)
                }
            }, 1000)
        })
}
