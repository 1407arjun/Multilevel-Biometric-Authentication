const createTextIndependentVerificationProfileEndpoint = `https://eastus2.api.cognitive.microsoft.com/speaker/verification/v2.0/text-independent/profiles`
const enrolTextIndependentVerificationProfileEndpoint = (profileId) =>
    `https://eastus2.api.cognitive.microsoft.com//speaker/verification/v2.0/text-independent/profiles/${profileId}/enrollments?ignoreMinLength=false`
const verifyTextIndependentProfileEndpoint = (profileId) =>
    `https://eastus2.api.cognitive.microsoft.com//speaker/verification/v2.0/text-independent/profiles/${profileId}/verify`
const speechKey = "d64e48a129aa4c2f94817c74ab76bd40"
let profileId
let voiceMatch = false

function createTextIndependentVerificationProfile(blob) {
    var request = new XMLHttpRequest()
    request.open("POST", createTextIndependentVerificationProfileEndpoint, true)
    request.setRequestHeader("Content-Type", "application/json")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", speechKey)

    request.onload = function () {
        console.log(request.responseText)
        var json = JSON.parse(request.responseText)
        profileId = json.profileId
        enrolTextIndependentProfileAudioForVerification(blob, profileId)
    }

    request.send(JSON.stringify({ locale: "en-us" }))
}

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
    request.setRequestHeader("Ocp-Apim-Subscription-Key", speechKey)
    request.onload = function () {
        console.log("enrolling")
        console.log(request.responseText)

        var json = JSON.parse(request.responseText)
        console.log(json)

        console.log("Verification should be enabled!")
        document.getElementById("create-account").disabled = false
    }

    request.send(blob)
}

function verifyTextIndependentProfile(blob) {
    setTimeout(() => {
        verifyFace(faceId1, faceId2)
    }, 8000)

    setTimeout(() => {
        if (faceMatch && voiceMatch) alert("User verified successfully")
        else if (faceMatch && !voiceMatch) alert("Voice does not match")
        else if (!faceMatch && voiceMatch) alert("Face does not match")
        else alert("Biometrics do not match")
    }, 12000)

    var request = new XMLHttpRequest()
    request.open("POST", verifyTextIndependentProfileEndpoint(profileId), true)

    request.setRequestHeader("Content-Type", "application/json")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", speechKey)

    request.onload = function () {
        console.log("verifying profile")
        const json = JSON.parse(request.responseText)
        console.log(json)

        voiceMatch =
            json.recognitionResult.toLowerCase() === "accept" ? true : false
    }

    request.send(blob)
}
