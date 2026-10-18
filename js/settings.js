class Settings {
    location = "Settings"

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

    async showLoading(){
        let popUp = document.getElementById("loading-notification")
        popUp.classList.add("show");
        popUp.classList.remove("hide");
        await this.sleep(3000)
        popUp.classList.remove("show");
        popUp.classList.add("hide2");
        await this.sleep(3000)
        popUp.classList.add("hide");
        popUp.classList.remove("hide2"); 
    }

    async testWebhook(webhook){
        let popUp = document.getElementById("success-notification")
        let loadingPopUp = document.getElementById("loading-notification")
        let errorPopUp = document.getElementById("error-notification")
        if (webhook){
            console.log("Testing the webhook!")
            this.showLoading()
            let discordPayload = {
                embeds: [{
                    author: {
                        name: 'Lollipop ext',
                        icon_url: "https://i.imgur.com/4cJK9wD.png",
                        url: "https://twitter.com/lollipop_ext"
                        },
                    title: "Hey it seems that your webhook is ready!",
                    color: 	16711935,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Webhook Tester - LollipopEXT"
                    },
                    image: {
                        url:
                          "https://cdn.discordapp.com/attachments/906187815191183420/910592969034305587/C4001E79-213F-4638-B1E9-19AD8C6F31C4.gif",
                      },
                }]
            };

            let response = await fetch(`${webhook}`, {
                method: 'POST',
                headers: {
                    "referer": "https://discohook.org/",
                    "referrerPolicy": "strict-origin",
                    "accept": "application/json",
                    "accept-language": "en",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                body: JSON.stringify(discordPayload)
            })

            let status = await response.status
            switch (status){
                case 204:
                    console.log("Webhook has been tested!")
                    if (loadingPopUp.className.includes("show") || loadingPopUp.className.includes("hide2")){
                        popUp.style.marginTop = "75px"
                        this.showSuccess()
                    } else {
                        this.showSuccess()
                    }
                    break
                case 200:
                    console.log("Webhook has been tested!")
                    if (loadingPopUp.className.includes("show") || loadingPopUp.className.includes("hide2")){
                        popUp.style.marginTop = "75px"
                        this.showSuccess()
                    } else {
                        this.showSuccess()
                    }
                    break
                default:
                    console.log("An error occured!")
                    if (loadingPopUp.className.includes("show") || loadingPopUp.className.includes("hide2")){
                        errorPopUp.style.marginTop = "75px"
                        this.showError()
                    } else {
                        this.showError()
                    }
                    break;
            }
        } else {
            console.log("Webhook is missing!")
            this.showError()
        }

    }
}

window.onload = () => {
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


    let successWebhook = document.getElementById("success-webhook")
    let failedWebhook = document.getElementById("failed-webhook")
    let testSuccessBtn = document.getElementById("test-success")
    let testFailedBtn = document.getElementById("test-failed")

    chrome.storage.local.get("userSuccessWebhook", function(data){
        if (data["userSuccessWebhook"] == undefined){
            console.log("User success webhook not found!")
        }
        else {
            successWebhook.value = data["userSuccessWebhook"]
        }
    })

    chrome.storage.local.get("userFailedWebhook", function(data){
        if (data["userFailedWebhook"] == undefined){
            console.log("User failed webhook not found!")
        }
        else {
            failedWebhook.value = data["userFailedWebhook"]
        }
    })

    successWebhook.addEventListener("change", () => {
        chrome.storage.local.set({
            ["userSuccessWebhook"] : successWebhook.value
        }, function() {
            console.log("Success webhook has been saved!")
        });
    })

    failedWebhook.addEventListener("change", () => {
        chrome.storage.local.set({
            ["userFailedWebhook"] : failedWebhook.value
        }, function() {
            console.log("Failed webhook has been saved!")
        });
    })

    testSuccessBtn.addEventListener("click", () => {
        new Settings().testWebhook(successWebhook.value)
    })

    testFailedBtn.addEventListener("click", () => {
        new Settings().testWebhook(failedWebhook.value)
    })
}
