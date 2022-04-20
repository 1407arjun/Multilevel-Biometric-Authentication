const webCamContainer = document.getElementById("web-cam-container")
const canvas = document.querySelector("canvas")
// This array stores the recorded media data
let chunks = []
let paused = true
let timer

// This constraints object tells
// the browser to include
// both the audio and video
// Media Tracks
const videoMediaConstraints = {
    // or you can set audio to
    // false to record
    // only video
    audio: true,
    video: true
}

// When the user clicks the "Start
// Recording" button this function
// gets invoked
function startRecording(thisButton, otherButton) {
    // Access the camera and microphone
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
            // Create a new MediaRecorder instance
            const mediaRecorder = new MediaRecorder(mediaStream)

            //Make the mediaStream global
            window.mediaStream = mediaStream
            //Make the mediaRecorder global
            window.mediaRecorder = mediaRecorder

            mediaRecorder.start()

            // Whenever (here when the recorder
            // stops recording) data is available
            // the MediaRecorder emits a "dataavailable"
            // event with the recorded media data.
            mediaRecorder.ondataavailable = (e) => {
                // Push the recorded media data to
                // the chunks array
                chunks.push(e.data)
            }

            // When the MediaRecorder stops
            // recording, it emits "stop"
            // event
            mediaRecorder.onstop = () => {
                /* A Blob is a File like object.
            In fact, the File interface is 
            based on Blob. File inherits the 
            Blob interface and expands it to
            support the files on the user's 
            systemThe Blob constructor takes 
            the chunk of media data as the 
            first parameter and constructs 
            a Blob of the type given as the 
            second parameter*/
                if (!paused) {
                    const blob = new Blob(chunks, {
                        type: "audio/mpeg"
                    })
                    chunks = []

                    // Create a video or audio element
                    // that stores the recorded media
                    const recordedMedia = document.createElement("audio")
                    recordedMedia.controls = true

                    // You can not directly set the blob as
                    // the source of the video or audio element
                    // Instead, you need to create a URL for blob
                    // using URL.createObjectURL() method.
                    const recordedMediaURL = URL.createObjectURL(blob)

                    // Now you can use the created URL as the
                    // source of the video or audio element
                    recordedMedia.src = recordedMediaURL

                    // Create a download button that lets the
                    // user download the recorded media
                    const downloadButton = document.createElement("a")

                    // Set the download attribute to true so that
                    // when the user clicks the link the recorded
                    // media is automatically gets downloaded.
                    downloadButton.download = "Recorded-Media"

                    downloadButton.href = recordedMediaURL
                    downloadButton.innerText = "Download it!"
                    downloadButton.id = "download"

                    downloadButton.onclick = () => {
                        /* After download revoke the created URL
                using URL.revokeObjectURL() method to 
                avoid possible memory leak. Though, 
                the browser automatically revokes the 
                created URL when the document is unloaded,
                but still it is good to revoke the created 
                URLs */
                        URL.revokeObjectURL(recordedMedia)
                    }

                    document
                        .getElementById(`vid-recorder`)
                        .append(recordedMedia, downloadButton)
                }
            }

            webCamContainer.srcObject = mediaStream

            document.getElementById(`vid-record-status`).innerText = "Recording"

            thisButton.disabled = true
            otherButton.disabled = false

            let time = 20
            let click = 20 - Math.floor(Math.random() * 20)
            console.log(click)
            timer = setInterval(() => {
                time--
                document.getElementById(
                    "timer"
                ).innerText = `${time} sec(s) remaining`
                if (time == click) {
                    console.log(canvas)
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

                    const dataURL = canvas.toDataURL()
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
    // Stop the recording
    window.mediaRecorder.stop()

    // Stop all the tracks in the
    // received media stream
    window.mediaStream.getTracks().forEach((track) => {
        track.stop()
    })

    document.getElementById(`vid-record-status`).innerText = "Recording done!"
    document.getElementById("timer").innerText = `20 sec(s) remaining`
    thisButton.disabled = true
    otherButton.disabled = false

    clearInterval(timer)
}
