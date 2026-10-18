class Snipes {
    location = "Sites"

    async displaySettings(){
        let snipesStatus = document.getElementById('SnipesWorking')
        let snipesMin = document.getElementById("rangeMinSnipes")
        let snipesMax = document.getElementById("rangeMaxSnipes")
        let snipesMode = document.getElementById("modeSnipes")
        let snipesDelay = document.getElementById("delay-input")
        

        chrome.storage.sync.get(["snipesStatus"], (result) => {
            if (result["snipesStatus"] && result["snipesStatus"] === "ON"){
                snipesStatus.checked = true
            } else {
                snipesStatus.checked = false
            }
        })

        chrome.storage.sync.get(["snipesMin"], (result) => {
            if (result["snipesMin"]){
                snipesMin.value = result["snipesMin"]
            } else {
                console.log("No snipes min has been found!")
            }
        })

        chrome.storage.sync.get(["snipesMax"], (result) => {
            if (result["snipesMax"]){
                snipesMax.value = result["snipesMax"]
            } else {
                console.log("No snipesMax has been found!")
            }
        })

        chrome.storage.sync.get(["snipesMode"], (result) => {
            if (result["snipesMode"]){
                snipesMode.value = result["snipesMode"]
            } else {
                console.log("No snipesMode has been found!")
            }
        })

        chrome.storage.sync.get(["snipesDelay"], (result) => {
            if (result["snipesDelay"]){
                snipesDelay.value = result["snipesDelay"]
            } else {
                console.log("No snipesDelay has been found!")
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

    let snipesStatus = document.getElementById('SnipesWorking')
    let snipesMin = document.getElementById("rangeMinSnipes")
    let snipesMax = document.getElementById("rangeMaxSnipes")
    let snipesMode = document.getElementById("modeSnipes")
    let snipesDelay = document.getElementById("delay-input")

    snipesStatus.addEventListener('change', function() {
        if (snipesStatus.checked === true){
            chrome.storage.sync.set({
                ["snipesStatus"] : "ON"
            }, () => {
                console.log("Snipes status has been modified!")
            })
        } else {
            chrome.storage.sync.set({
                ["snipesStatus"] : "OFF"
            }, () => {
                console.log("Snipes status has been modified!")
            })
        }
    })

    snipesMin.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["snipesMin"] : snipesMin.value
        }, () => {
            console.log("Snipes min has been modified!")
        })
    })

    snipesMax.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["snipesMax"] : snipesMax.value
        }, () => {
            console.log("Snipes max has been modified!")
        })
    })

    snipesMode.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["snipesMode"] : snipesMode.value
        }, () => {
            console.log("Snipes mode has been modified!")
        })
    })

    snipesDelay.addEventListener('change', function() {
        chrome.storage.sync.set({
            ["snipesDelay"] : snipesDelay.value
        }, () => {
            console.log("Snipes delay has been modified!")
        })
    })

    new Snipes().displaySettings()
}
