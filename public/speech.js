const createTextIndependentVerificationProfileEndpoint = `https://eastus2.api.cognitive.microsoft.com/speaker/verification/v2.0/text-independent/profiles`
const enrolTextIndependentVerificationProfileEndpoint = (profileId) =>
    `https://eastus2.api.cognitive.microsoft.com//speaker/verification/v2.0/text-independent/profiles/${profileId}/enrollments?ignoreMinLength=false`
const verifyTextIndependentProfileEndpoint = (profileId) =>
    `https://eastus2.api.cognitive.microsoft.com//speaker/verification/v2.0/text-independent/profiles/${profileId}/verify`
const key = "d64e48a129aa4c2f94817c74ab76bd40"

// createTextIndependentVerificationProfile calls the profile endpoint to get a profile Id, then calls enrollProfileAudioForVerification
function createTextIndependentVerificationProfile(blob) {
    // just check if we've already fully enrolled this profile
    if (verificationProfile && verificationProfile.profileId) {
        if (verificationProfile.remainingEnrollmentsSpeechLength == 0) {
            console.log("Verification enrollment already completed")
            return
        } else {
            console.log(
                "Verification enrollment time remaining: " +
                    verificationProfile.remainingEnrollmentsSpeechLength
            )
            enrolTextIndependentProfileAudioForVerification(
                blob,
                verificationProfile.profileId
            )
            return
        }
    }

    var request = new XMLHttpRequest()
    request.open("POST", createTextIndependentVerificationProfileEndpoint, true)
    request.setRequestHeader("Content-Type", "application/json")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key)

    request.onload = function () {
        console.log(request.responseText)
        var json = JSON.parse(request.responseText)
        var profileId = json.profileId
        verificationProfile.profileId = profileId

        // Now we can enrol this profile with the profileId
        enrolTextIndependentProfileAudioForVerification(blob, profileId)
    }

    request.send(JSON.stringify({ locale: "en-us" }))
}

// enrolTextIndependentProfileAudioForVerification enrols the recorded audio with the new profile Id
function enrolTextIndependentProfileAudioForVerification(blob, profileId) {
    if (profileId == undefined) {
        console.log("Failed to create a profile for verification; try again")
        return
    }

    var request = new XMLHttpRequest()
    request.open(
        "POST",
        enrolTextIndependentVerificationProfileEndpoint(profileId),
        true
    )
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key)
    request.onload = function () {
        console.log("enrolling")
        console.log(request.responseText)

        var json = JSON.parse(request.responseText)

        verificationProfile.remainingEnrollmentsSpeechLength =
            json.remainingEnrollmentsSpeechLength
        if (verificationProfile.remainingEnrollmentsSpeechLength == 0) {
            console.log("Verification should be enabled!")

            var request = new XMLHttpRequest()
            request.open(
                "POST",
                verifyTextIndependentProfileEndpoint(
                    verificationProfile.profileId
                ),
                true
            )

            request.setRequestHeader("Content-Type", "application/json")
            request.setRequestHeader("Ocp-Apim-Subscription-Key", key)

            request.onload = function () {
                console.log("verifying profile")

                // Was it a match?
                console.log(JSON.parse(request.responseText))
            }

            request.send({
                profileId: profileId
            })
        }
    }

    request.send(blob)
}

// 2. Start the browser listening, listen for 4 seconds, pass the audio stream to "verifyTextIndependentProfile"
function startListeningForTextIndependentVerification() {
    if (verificationProfile.profileId) {
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
                            type: "audio/wav; codecs=audio/pcm"
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
                        verifyTextIndependentProfile(blob)
                    }
                }

                webCamContainer.srcObject = mediaStream

                document.getElementById(`vid-record-status`).innerText =
                    "Verifying"
                document.getElementById(
                    "timer"
                ).innerText = `6 sec(s) remaining`

                let time = 6
                timer = setInterval(() => {
                    time--
                    document.getElementById(
                        "timer"
                    ).innerText = `${time} sec(s) remaining`
                    if (time <= 0) {
                        paused = false
                        window.mediaRecorder.stop()
                        // Stop all the tracks in the
                        // received media stream
                        window.mediaStream.getTracks().forEach((track) => {
                            track.stop()
                        })
                        document.getElementById(`vid-record-status`).innerText =
                            "Verification done!"
                        clearInterval(timer)
                    }
                }, 1000)
            })
    } else {
        console.log(
            "No verification profile enrolled yet! Click the other button..."
        )
    }
}

// 3. Take the audio and send it to the verification endpoint for the current profile Id
function verifyTextIndependentProfile(blob) {
    var request = new XMLHttpRequest()
    request.open(
        "POST",
        verifyTextIndependentProfileEndpoint(verificationProfile.profileId),
        true
    )

    request.setRequestHeader("Content-Type", "application/json")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", key)

    request.onload = function () {
        console.log("verifying profile")

        // Was it a match?
        console.log(JSON.parse(request.responseText))
    }

    request.send(blob)
}
