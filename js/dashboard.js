
class Dashboard {
    location = "dashboard";
    port;

    version = 0.2

    constructor(){
        this.port = chrome.runtime.connect({ name: 'dashboard' });
    }

    async sleep(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async showSuccess(){
        let popUp = document.getElementById("success-notification")
        popUp.classList.add("show");
        popUp.classList.remove("hide");
        await this.sleep(3000)
        popUp.classList.remove("show");
        popUp.classList.add("hide2");
        await this.sleep(3000)
        popUp.classList.add("hide");
        popUp.classList.remove("hide2");
    }

    async showError(){
        let popUp = document.getElementById("error-notification")
        popUp.classList.add("show");
        popUp.classList.remove("hide");
        await this.sleep(3000)
        popUp.classList.remove("show");
        popUp.classList.add("hide2");
        await this.sleep(3000)
        popUp.classList.add("hide");
        popUp.classList.remove("hide2");
    }

    async checkVersion(){
        this.port.postMessage({ action: "check_version", key: this.licenseKey });
        this.port.onMessage.addListener((msgData) => {
            if (msgData.msg === "success"){
                if (this.version < msgData.data["current-version"]){
                    console.log("New version available")
                    document.querySelector("span[class*='version-txt']").innerHTML = `Version: ${msgData.data["current-version"]} available!`
                    this.showSuccess()
                } else {
                    console.log("Version up to date")
                }
            } else {
                console.log("Error while checking version!")
                this.showError()
            }
        })
    }

    async updateValues(){
        let userName = document.getElementById("username")
        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                userName.innerHTML = result["userDiscordName"]
            }
        })

        let userPicture = document.getElementById("user-photo")
        chrome.storage.sync.get(["userProfilePic"], (result) => {
            if (result["userProfilePic"]){
                userPicture.src = result["userProfilePic"]
            }
        })
        
        let userLicense = document.getElementById("license-value")
        chrome.storage.sync.get(["userLicense"], (result) => {
            if (result["userLicense"]){
                userLicense.innerHTML = result["userLicense"]
            }
        })

        let plan = document.getElementById("license-type-value")
        chrome.storage.sync.get(["userPlan"], (result) => {
            if (result["userPlan"]){
                plan.innerHTML = result["userPlan"]
            }
        })

        let totalSuccess = document.getElementById("total-success-value")
        let success = document.getElementById("success")
        let failed = document.getElementById("failed")
        chrome.storage.local.get(["userSuccessCount"], (result) => {
            if (result["userSuccessCount"]){
                let jsonData = JSON.parse(result["userSuccessCount"])
                if (jsonData.totalSuccess){
                    totalSuccess.innerHTML = jsonData.totalSuccess
                }
                if (jsonData.success){
                    success.innerHTML = jsonData.success
                }
                if (jsonData.failed){
                    failed.innerHTML = jsonData.failed
                }
            } else {
                console.log("Success count not found!")
            }
        })

    }
}

window.onload = () => {
    let task = new Dashboard()
    task.updateValues()

    let dashboardBtn = document.getElementById("dashboard-btn")
    let sitesBtn = document.getElementById("sites-btn")
    let profilesBtn = document.getElementById("profiles-btn")
    let settingsBtn = document.getElementById("settings-btn")
    let historyBtn = document.getElementById("history-btn")

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

    let discordBtn = document.getElementById("discord-url")
    let guidesBtn = document.getElementById("guides-url")
    let twitterBtn = document.getElementById("twitter-url")
    let instaBtn = document.getElementById("instagram-url")

    discordBtn.addEventListener("click", function() {
        chrome.tabs.create({url:"https://discord.com/channels/893821006794330142/894913441381371914"});
    })

    guidesBtn.addEventListener("click", function() {
        chrome.tabs.create({url:"https://lollipopext.hyper.co/guides/lollipopext-guide-lYje"});
    })

    twitterBtn.addEventListener("click", function() {
        chrome.tabs.create({url:"https://twitter.com/lollipop_ext"});
    })

    instaBtn.addEventListener("click", function() {
        chrome.tabs.create({url:"https://www.instagram.com/lollipop_ext/"});
    })
}
