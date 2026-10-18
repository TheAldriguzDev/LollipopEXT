class LVR {
    location = "Sites"

    async displaySettings(){
        let lvrStatus = document.getElementById('LvrWorking')
        let selectProfile = document.getElementById("selectProfile")
        let lvrMin = document.getElementById("rangeMinLVR")
        let lvrMax = document.getElementById("rangeMaxLVR")

        chrome.storage.sync.get(["lvrStatus"], (result) => {
            if (result["lvrStatus"] && result["lvrStatus"] === "ON"){
                lvrStatus.checked = true
            } else {
                lvrStatus.checked = false
            }
        })

        chrome.storage.sync.get(["lvrProfile"], (result) => {
            if (result["lvrProfile"]){
                selectProfile.value = result["lvrProfile"]
            } else {
                console.log("No lvr profile has been found!")
            }
        })

        chrome.storage.sync.get(["lvrMin"], (result) => {
            if (result["lvrMin"]){
                lvrMin.value = result["lvrMin"]
            } else {
                console.log("No lvr min has been found!")
            }
        })

        chrome.storage.sync.get(["lvrMax"], (result) => {
            if (result["lvrMax"]){
                lvrMax.value = result["lvrMax"]
            } else {
                console.log("No lvr has been found!")
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

    let lvrStatus = document.getElementById('LvrWorking')
    let selectProfile = document.getElementById("selectProfile")
    let lvrMin = document.getElementById("rangeMinLVR")
    let lvrMax = document.getElementById("rangeMaxLVR")
    let lvrUrl = document.getElementById("set-address")

    lvrStatus.addEventListener('change', function() {
        if (lvrStatus.checked === true){
            chrome.storage.sync.set({
                ["lvrStatus"] : "ON"
            }, () => {
                console.log("LVR status has been modified!")
            })
        } else {
            chrome.storage.sync.set({
                ["lvrStatus"] : "OFF"
            }, () => {
                console.log("LVR status has been modified!")
            })
        }
    })

    selectProfile.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["lvrProfile"] : selectProfile.value
        }, () => {
            console.log("LVR profile has been modified!")
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

    lvrMin.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["lvrMin"] : lvrMin.value
        }, () => {
            console.log("LVR min has been modified!")
        })
    })

    lvrMax.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["lvrMax"] : lvrMax.value
        }, () => {
            console.log("LVR max has been modified!")
        })
    })

    lvrUrl.addEventListener("click", function() {
        chrome.tabs.create({url:"https://www.luisaviaroma.com/myarea/addresses?lolli"});
    })

    new LVR().displaySettings()
}
