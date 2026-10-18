class Sites {
    location = "Sites"

    async displayStatus(){
        let airnessCircle1 = document.getElementById('airness-stable-circle-online')
        let airnessCircle2 = document.getElementById('airness-pulsating-circle-online')

        let snipesCircle1 = document.getElementById('snipes-stable-circle-online')
        let snipesCircle2 = document.getElementById('snipes-pulsating-circle-online')

        let soleboxCircle1 = document.getElementById('solebox-stable-circle-online')
        let soleboxCircle2 = document.getElementById('solebox-pulsating-circle-online')

        let lvrCircle1 = document.getElementById('lvr-stable-circle-online')
        let lvrCircle2 = document.getElementById('lvr-pulsating-circle-online')
        

        chrome.storage.sync.get(["snipesStatus"], (result) => {
            if (result["snipesStatus"] && result["snipesStatus"] === "ON"){
                snipesCircle1.className = "snipes-stable-circle-online";
                snipesCircle2.className = "snipes-pulsating-circle-online"
            } else {
                snipesCircle1.className = "snipes-stable-circle-offline";
                snipesCircle2.className = "snipes-pulsating-circle-offline"
            }
            console.log("changed")
        })

        chrome.storage.sync.get(["soleboxStatus"], (result) => {
            if (result["soleboxStatus"] && result["soleboxStatus"] === "ON"){
                soleboxCircle1.className = "solebox-stable-circle-online";
                soleboxCircle2.className = "solebox-pulsating-circle-online"
            } else {
                soleboxCircle1.className = "solebox-stable-circle-offline";
                soleboxCircle2.className = "solebox-pulsating-circle-offline"
            }
            console.log("changed")
        })

        chrome.storage.sync.get(["airnessStatus"], (result) => {
            if (result["airnessStatus"] && result["airnessStatus"] === "ON"){
                airnessCircle1.className = "lvr-stable-circle-online";
                airnessCircle2.className = "lvr-pulsating-circle-online"
            } else {
                airnessCircle1.className = "lvr-stable-circle-offline";
                airnessCircle2.className = "lvr-pulsating-circle-offline"
            }
            console.log("changed")
        })

        chrome.storage.sync.get(["lvrStatus"], (result) => {
            if (result["lvrStatus"] && result["lvrStatus"] === "ON"){
                lvrCircle1.className = "lvr-stable-circle-online";
                lvrCircle2.className = "lvr-pulsating-circle-online"
            } else {
                lvrCircle1.className = "lvr-stable-circle-offline";
                lvrCircle2.className = "lvr-pulsating-circle-offline"
            }
            console.log("changed")
        })
    }
}

window.onload = () => {
    let dashboardBtn = document.getElementById("dashboard-btn")
    let sitesBtn = document.getElementById("sites-btn")
    let profilesBtn = document.getElementById("profiles-btn")
    let settingsBtn = document.getElementById("settings-btn")
    let historyBtn = document.getElementById("history-btn")

    let airnessBtn = document.getElementById("airness")
    let snipesBtn = document.getElementById("snipes")
    let soleboxBtn = document.getElementById("solebox")
    let lvrBtn = document.getElementById("lvr")

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

    airnessBtn.addEventListener("click", () => {
        window.location.replace('./airness.html');
    })

    snipesBtn.addEventListener("click", () => {
        window.location.replace('./snipes.html');
    })

    soleboxBtn.addEventListener("click", () => {
        window.location.replace('./sbx.html');
    })

    lvrBtn.addEventListener("click", () => {
        window.location.replace('./lvr.html');
    })

    new Sites().displayStatus()
}
