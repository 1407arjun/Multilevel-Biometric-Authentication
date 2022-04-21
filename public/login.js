let faceId2

function getUser() {
    const username = document.getElementById("username").value

    var request = new XMLHttpRequest()
    request.open("GET", `/user?username=${username}`, true)
    request.setRequestHeader("Content-Type", "application/json")

    request.onload = function () {
        const json = JSON.parse(request.responseText)
        console.log(json)
        alert("User loaded successfully")
        profileId = json.profileId
        startFaceDetection(json.face, 1)
    }

    request.send()
}
