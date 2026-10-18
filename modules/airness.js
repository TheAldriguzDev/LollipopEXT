class Airness {
    location = "Airness"
    port;
    removeListenerFunctions = []

    constructor(sku){
        this.sku = sku;
        this.port = chrome.runtime.connect({ name: 'airness' });
    }

    async injectConsole(){
        console.log("Injecting console...")
        document.querySelector("body").innerHTML += `
        <style>
            @import url(https://fonts.googleapis.com/css2?family=Poppins&display=swap);

            @font-face {
                font-family: Poppins;
                src: url(https://fonts.googleapis.com/css2?family=Poppins&display=swap);
            }
        
            @keyframes fadein {
            from {
                opacity:0;
            }
            to {
                opacity:1;
            }
            }
        
            @-moz-keyframes fadein { /* Firefox */
                from {
                    opacity:0;
                }
                to {
                    opacity:1;
                }
            }
            @-webkit-keyframes fadein { /* Safari and Chrome */
                from {
                    opacity:0;
                }
                to {
                    opacity:1;
                }
            }
            @-o-keyframes fadein { /* Opera */
                from {
                    opacity:0;
                }
                to {
                    opacity: 1;
                }
            }

            .lollipopUp{
                position: fixed; 
                bottom: 10%;
                left: 15px;
                width: 400px;
                height: 300px;
                background-color: rgba(34.00000177323818, 34.00000177323818, 49.00000087916851, 1);;
                border-radius: 7px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
            }
        
            .logo-div{
                height: 40px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        
            .lollipop {
                color: rgba(241.00000083446503, 241.00000083446503, 241.00000083446503, 1);
                font-size: 22px;
                font-family: Poppins;
            }
        
            .ext {
                color: #98A8F8;
                font-size: 20px;
                font-family: Poppins;
            }
        
            .separator{
                width: 60%;
                height: 1px;
                border-radius: 7px;
                background-color: rgba(241.00000083446503, 241.00000083446503, 241.00000083446503, 1);
            }
        
            .notifications{
                background-color: rgba(42.889582961797714, 42.889582961797714, 59.50000025331974, 1);
                margin-top: 5px;
                width: 85%;
                height: 80%;
                border-radius: 7px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                overflow-y: scroll;
            }
        
            .new-notification{
                background-color: rgba(57.98593729734421, 57.98593729734421, 78.62500101327896, 1);
                height: 40px;
                width: 95%;
                border-radius: 7px;
                margin-top: 5px;
                margin-left: 5px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                min-height: 40px;
                animation: fadein 1.2s;
                -moz-animation: fadein 1.2s; /* Firefox */
                -webkit-animation: fadein 1.2s; /* Safari and Chrome */
                -o-animation: fadein 1.2s; /* Opera */
            }
        
            .general-header{
                background-color: #98A8F8;
                width: 5px;
                height: 100%;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;
            }
        
            .success-header{
                background-color: #A7E9AF;
                width: 5px;
                height: 100%;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;
            }
        
            .failed-header{
                background-color: #D35D6E;
                width: 5px;
                height: 100%;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;
            }
        
            .loading-header{
                background-color: #F2D388;
                width: 5px;
                height: 100%;
                border-top-left-radius: 7px;
                border-bottom-left-radius: 7px;
            }
        
            .desc-div{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 98%;
            }
            .notification-description{
                font-family: Poppins;
                font-size: 18px;
                color: rgba(241.00000083446503, 241.00000083446503, 241.00000083446503, 1);
            }
        
            ::-webkit-scrollbar {
            width: 4px;
            border-radius: 8px;
            }
            
            ::-webkit-scrollbar-thumb {
                background-color: #98A8F8;
                border-radius: 7px;
            }

            a {
                color: #98A8F8;
                font-family: Poppins;
                font-size: 18px;
                background-color: transparent;
                text-decoration: none;
            }
        
            a:hover{
                cursor: pointer;
            }
    </style>

        <div class="lollipopUp">
            <div class="logo-div">
                <span class="lollipop">Lollipop</span>
                <span class="ext">EXT</span>
            </div>
            <div class="separator"></div>
            <div class="notifications">
                <div class="new-notification">
                    <div class="general-header"></div>
                    <div class="desc-div">
                        <span class="notification-description">LollipopEXT console</span>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    async addMessage(msg, notificationType){
        document.querySelector("div[class*='notifications']").insertAdjacentHTML(
            "afterbegin",
            `<div class="new-notification">
                <div class="${notificationType}-header"></div>
                <div class="desc-div">
                    <span class="notification-description">${msg}</span>
                </div>
            </div>`
        );
    }

    async addMessageUrl(msg, notificationType, url){
        document.querySelector("div[class*='notifications']").insertAdjacentHTML(
            "afterbegin",
            `<div class="new-notification">
                <div class="${notificationType}-header"></div>
                <div class="desc-div">
                    <a href="${url}">${msg}</a>
                </div>
            </div>`
        );
    }


    async startAirness(profileName, mode){
        try {
            chrome.storage.sync.get(["profiles"], (result) => {
                if (result["profiles"]){
                    let profileJSON = JSON.parse(result["profiles"])
                    let i = 0;
                    while (profileJSON.profiles[i].name != profileName){
                        i++;
                    }
                    let profileData = {
                        firstName: profileJSON.profiles[i].info.firstName,
                        lastName: profileJSON.profiles[i].info.lastName,
                        street: profileJSON.profiles[i].info.street,
                        houseNumber: profileJSON.profiles[i].info.houseNumber,
                        city: profileJSON.profiles[i].info.city,
                        postalCode: profileJSON.profiles[i].info.postalCode,
                        state: profileJSON.profiles[i].info.state,
                        country: profileJSON.profiles[i].info.country,
                        email: profileJSON.profiles[i].info.email,
                        phone: profileJSON.profiles[i].info.phone
                    }
                    this.port.postMessage({ action: "start_module", sku: this.sku, profileInfo: profileData, mode: mode});
                    this.messageParser()
                } else {
                    console.log("No profiles has been found!")
                }
            })
        } catch (error) {
            console.log("Errr while getting the profile!")
        }
    }

    async messageParser(){
        let callback = async (details) => {
            if (details.msg){
                if (details.url){
                    this.addMessageUrl(details.msg, details.status, details.url)
                    if (details.url.includes("paypal")){
                        this.openUrl(details.url)
                    }
                } else {
                    this.addMessage(details.msg, details.status)
                }
            } else {
                console.log("Error while reading the new message from background!")
                console.log(details)
            }
        }

        // Register listener
        this.port.onMessage.addListener(callback);
        // Save anonymous function that removes the listener
        this.removeListenerFunctions.push(() => this.port.onMessage.removeListener(callback));
    }

    async openUrl(url){
        let w = 600
        let h = 600
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
    }
}



let counter = 0
window.onload = () => {
    chrome.storage.sync.get(["airnessStatus"], (result) => {
        if (result["airnessStatus"] && result["airnessStatus"] === "ON"){
            console.log("Starting airness module...")
            try {
                if (counter === 0){
                    counter++;
                    try {
                        let airnessMode = ""
                        let airnessProfile = ""
                        let airnessSku = ""
                        chrome.storage.sync.get(["airnessMode"], (result) => {
                            if (result["airnessMode"]){
                                airnessMode = result["airnessMode"]
                                chrome.storage.sync.get(["airnessProfile"], (resultProfile) => {
                                    if (resultProfile["airnessProfile"]){
                                        airnessProfile = resultProfile["airnessProfile"]
                                        if (airnessMode.includes("sku")){
                                            chrome.storage.sync.get(["airnessSku"], (result) => {
                                                if (result["airnessSku"]){
                                                    airnessSku = result["airnessSku"]
                                                    let task = new Airness(airnessSku)
                                                    task.injectConsole()
                                                    task.startAirness(airnessProfile, airnessMode)
                                                } else {
                                                    console.log("No airness sku has been found!")
                                                }
                                            })
                                        } else {
                                            console.log("Going with normal mode!")
                                            airnessSku = document.querySelector("span[itemprop*='sku']").getAttribute("content")
                                            let task = new Airness(airnessSku)
                                            task.injectConsole()
                                            task.startAirness(airnessProfile, airnessMode)
                                        }
                                    } else {
                                        console.log("No airness profile has been found!")
                                    }
                                })
                            } else {
                                console.log("No airness mode has been found!")
                            }
                        })
                    } catch (error) {
                        console.log("Error while starting Airness module!")
                    }
                }   
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Module offline")
        }
    })
}