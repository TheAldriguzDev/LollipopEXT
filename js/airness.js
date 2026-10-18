class Airness {
    location = "Sites"

    async displaySettings(){
        let airnessStatus = document.getElementById('AirnessWorking')
        let airnessMode = document.getElementById("select-mode")
        let airnessSku = document.getElementById("airness-sku")
        let selectProfile = document.getElementById("selectProfile")
        

        chrome.storage.sync.get(["airnessStatus"], (result) => {
            if (result["airnessStatus"] && result["airnessStatus"] === "ON"){
                airnessStatus.checked = true
            } else {
                airnessStatus.checked = false
            }
        })

        chrome.storage.sync.get(["airnessMode"], (result) => {
            if (result["airnessMode"]){
                airnessMode.value = result["airnessMode"]
            } else {
                console.log("No airness mode has been found!")
            }
        })

        chrome.storage.sync.get(["airnessProfile"], (result) => {
            if (result["airnessProfile"]){
                selectProfile.value = result["airnessProfile"]
            } else {
                console.log("No airness profile has been found!")
            }
        })

        chrome.storage.sync.get(["airnessSku"], (result) => {
            if (result["airnessSku"]){
                airnessSku.value = result["airnessSku"]
            } else {
                console.log("No airness sku has been found!")
            }
        })


    }
}

window.onload = () => {
    let dashboardBtn = document.getElementById("dashboard-btn")
    let sitesBtn = document.getElementById("sites-btn")
    let profilesBtn = document.getElementById("profiles-btn")
    let settingsBtn = document.getElementById("settings-btn")
    let historyBtn = document.getElementById("history-btn")
    let goto = document.getElementById("back-to-sites-div")

    dashboardBtn.addEventListener("click", () => {
        window.location.replace('./dashboard.html');
    })

    sitesBtn.addEventListener("click", () => {
        window.location.replace('./sites.html');
    })

    profilesBtn.addEventListener("click", () => {
        window.location.replace('./profiles.html');
    })

    settingsBtn.addEventListener("click", () => {
        window.location.replace('./settings.html');
    })

    historyBtn.addEventListener("click", () => {
        window.location.replace('./history.html');
    })

    goto.addEventListener("click", () => {
        window.location.replace('./sites.html');
    })

    let airnessStatus = document.getElementById('AirnessWorking')
    let airnessMode = document.getElementById("select-mode")
    let airnessSku = document.getElementById("airness-sku")
    let selectProfile = document.getElementById("selectProfile")

    airnessStatus.addEventListener('change', function() {
        if (airnessStatus.checked === true){
            chrome.storage.sync.set({
                ["airnessStatus"] : "ON"
            }, () => {
                console.log("Airness status has been modified!")
            })
        } else {
            chrome.storage.sync.set({
                ["airnessStatus"] : "OFF"
            }, () => {
                console.log("Airness status has been modified!")
            })
        }
    })

    airnessMode.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["airnessMode"] : airnessMode.value
        }, () => {
            console.log("Airness mode has been modified!")
        })
    })

    airnessSku.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["airnessSku"] : airnessSku.value
        }, () => {
            console.log("Airness sku has been modified!")
        })
    })

    selectProfile.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["airnessProfile"] : selectProfile.value
        }, () => {
            console.log("Airness profile has been modified!")
        })
    })

    chrome.storage.sync.get(["profiles"], (result) => {
        if (result["profiles"]){
            let profilesJSON = JSON.parse(result["profiles"])
            for (let i = 0; i < profilesJSON.profiles.length; i++){
                let select = document.getElementById("selectProfile");
                let option = document.createElement("option");
                option.value = profilesJSON.profiles[i].name;
                option.text = profilesJSON.profiles[i].name;
                select.add(option);
            }
        }
    })

    new Airness().displaySettings()
}
