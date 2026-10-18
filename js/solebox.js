class Airness {
    location = "Sites"

    async displaySettings(){
        let soleboxStatus = document.getElementById('SoleboxWorking')
        let soleboxMin = document.getElementById("rangeMinsolebox")
        let soleboxMax = document.getElementById("rangeMaxsolebox")
        

        chrome.storage.sync.get(["soleboxStatus"], (result) => {
            if (result["soleboxStatus"] && result["soleboxStatus"] === "ON"){
                soleboxStatus.checked = true
            } else {
                soleboxStatus.checked = false
            }
        })

        chrome.storage.sync.get(["soleboxMin"], (result) => {
            if (result["soleboxMin"]){
                soleboxMin.value = result["soleboxMin"]
            } else {
                console.log("No solebox min has been found!")
            }
        })

        chrome.storage.sync.get(["soleboxMax"], (result) => {
            if (result["soleboxMax"]){
                soleboxMax.value = result["soleboxMax"]
            } else {
                console.log("No soleboxMax has been found!")
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

    let soleboxStatus = document.getElementById('SoleboxWorking')
    let soleboxMin = document.getElementById("rangeMinsolebox")
    let soleboxMax = document.getElementById("rangeMaxsolebox")

    soleboxStatus.addEventListener('change', function() {
        if (soleboxStatus.checked === true){
            chrome.storage.sync.set({
                ["soleboxStatus"] : "ON"
            }, () => {
                console.log("solebox status has been modified!")
            })
        } else {
            chrome.storage.sync.set({
                ["soleboxStatus"] : "OFF"
            }, () => {
                console.log("solebox status has been modified!")
            })
        }
    })

    soleboxMin.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["soleboxMin"] : soleboxMin.value
        }, () => {
            console.log("solebox min has been modified!")
        })
    })

    soleboxMax.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["soleboxMax"] : soleboxMax.value
        }, () => {
            console.log("solebox max has been modified!")
        })
    })
    new Airness().displaySettings()
}
