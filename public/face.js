const createFaceDetectionEndpoint = `https://arjun1407.cognitiveservices.azure.com/face/v1.0/detect?overload=stream&returnFaceId=true`
const createFaceVerificationEndpoint = `https://arjun1407.cognitiveservices.azure.com/face/v1.0/verify`
const faceKey = "dab40dd018bf4e52823616275ae58e68"

function b64toBlob(b64DataStr, sliceSize = 512) {
    const byteCharacters = atob(b64DataStr)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: "application/octet-stream" })
    return blob
}

function startFaceDetection(dataURL) {
    const blob = b64toBlob(dataURL.split(",")[1])
    console.log(blob)

    var request = new XMLHttpRequest()
    request.open("POST", createFaceDetectionEndpoint, true)
    request.setRequestHeader("Content-Type", "application/octet-stream")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", faceKey)
    request.onload = function () {
        console.log("enrolling face")
        console.log(request.responseText)
    }

    request.send(blob)
}

function verifyFace(faceId1, faceId2) {
    var request = new XMLHttpRequest()
    request.open("POST", createFaceDetectionEndpoint, true)
    request.setRequestHeader("Content-Type", "application/octet-stream")
    request.setRequestHeader("Ocp-Apim-Subscription-Key", faceKey)
    request.onload = function () {
        console.log("verifying face")
        console.log(request.responseText)
    }

    request.send({ faceId1, faceId2 })
}
