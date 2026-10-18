class Snipes {
    location = "Snipes checkout"
    port;
    image = "https://www.snipes.it/on/demandware.static/Sites-snse-SOUTH-Site/-/default/dw677db77d/images/snipes_logo_white.svg"
    name = ""
    mainName = ""
    color = ""
    size = ""
    cartPrice = ""
    userName = ""
    userWebhook = ""
    removeListenerFunctions = []

    d
    locale
    regions = {
        "com" : "Sites-snse-DE-AT-Site/de_DE",
        "fr" : "Sites-snse-FR-Site/fr_FR",
        "es" : "Sites-snse-SOUTH-Site/es_ES",
        "be" : "Sites-snse-NL-BE-Site/nl_BE",
        "it" : "Sites-snse-SOUTH-Site/it_IT",
        "nl" : "Sites-snse-NL-BE-Site/nl_NL"
    }

    snipesMode = "human-safe"
    snipesDelay = 3000
    shipmentUUID

    constructor(sku, domain){
        this.sku = sku;
        this.port = chrome.runtime.connect({ name: 'snipes' });
        this.domain = domain

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


    async updateSuccessCount(type){
        chrome.storage.local.get(["userSuccessCount"], (result) => {
            if (result["userSuccessCount"]){
                let jsonData = JSON.parse(result["userSuccessCount"])
                switch (type){
                    case "success":
                        if (jsonData.success){
                            jsonData.success += 1
                            jsonData.totalSuccess += 1
                        } else {
                            jsonData.success = 1
                            if (jsonData.totalSuccess){
                                jsonData.totalSuccess += 1
                            } else {
                                jsonData.totalSuccess = 1
                            }
                        }
                        chrome.storage.local.set({
                            ["userSuccessCount"] : JSON.stringify(jsonData)
                        }, function() {
                            console.log("Success count has been updated!")
                        });
                        break;
                    case "failed":
                        if (jsonData.failed){
                            jsonData.failed += 1
                            jsonData.totalSuccess += 1
                        } else {
                            jsonData.failed = 1
                            if (jsonData.totalSuccess){
                                jsonData.totalSuccess += 1
                            } else {
                                jsonData.totalSuccess = 1
                            }
                        }
                        chrome.storage.local.set({
                            ["userSuccessCount"] : JSON.stringify(jsonData)
                        }, function() {
                            console.log("Success count has been updated!")
                        });
                        break;
                    default:
                        console.log("Type not found!")
                }
            } else {
                let data = {
                    totalSuccess: 0,
                    success: 0,
                    failed: 0
                }
                chrome.storage.local.set({
                    ["userSuccessCount"] : JSON.stringify(data)
                }, function() {
                    console.log("Success count has been updated!")
                    this.updateSuccessCount(type)
                });
            }
        })
    }

    async saveHistory(){
        chrome.storage.local.get(["userSuccess"], (result) => {
            if (result["userSuccess"]){
                let jsonData = JSON.parse(result["userSuccess"])
                let newData = {
                    image: this.image,
                    store: "Snipes",
                    name: this.mainName,
                    date: Utils.getCurrentDate()
                }
                jsonData.data.push(newData);
                chrome.storage.local.set({
                    ["userSuccess"] : JSON.stringify(jsonData)
                }, function() {
                    console.log("Success has been updated!")
                });
            } else {
                console.log("Success not found!")
                let jsonData = {
                    data: [{
                        image: this.image,
                        store: "Snipes",
                        name: this.mainName,
                        date: Utils.getCurrentDate()
                    }]
                }
                chrome.storage.local.set({
                    ["userSuccess"] : JSON.stringify(jsonData)
                }, function() {
                    console.log("Success has been updated!")
                });
            }
        })
    }

    async messageParser(){
        let callback = async (details) => {
            if (details.msg){
                if (details.url){
                    if (details.url.includes("paypal")){
                        this.port.postMessage({action: "sendWebhook", data: details.url});
                        this.saveHistory()
                        this.updateSuccessCount("success")
                        this.openUrl(details.url)
                        this.sendWebhook(details.url)
                    }
                } else {
                    if (details.msg === "Submit shipping"){
                        this.checkShipping()
                    } else {
                        this.addMessage(details.msg, details.status)
                    }
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

    async initCheckout(){
        this.locale = this.regions[this.domain]
        chrome.storage.sync.get(["snipesMode"], (result) => {
            if (result["snipesMode"]){
                this.snipesMode = result["snipesMode"]
            } else {
                console.log("No snipesMode has been found!")
            }
        })

        chrome.storage.sync.get(["snipesDelay"], (result) => {
            if (result["snipesDelay"]){
                this.snipesDelay = result["snipesDelay"]
            } else {
                console.log("No snipesDelay has been found!")
            }
        })

        chrome.storage.local.get("userSuccessWebhook", (data) => {
            if (data["userSuccessWebhook"] == undefined){
                console.log("User success webhook not found!")
            }
            else {
                this.userWebhook = data["userSuccessWebhook"]
            }
        })

        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                switch (this.snipesMode){
                    case "human-classic":
                        this.checkout()
                        break;
                    case "human-safe":
                        this.checkout()
                        break;
                    case "human":
                        this.hybridCheckout()
                        break;
                    default:
                        this.hybridCheckout()
                        break;
                }
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async hybridCheckout(){
        this.injectConsole()
        this.shipmentUUID = document.querySelector("input[name*='originalShipmentUUID']").getAttribute("value")
        this.shippingStep()
    }

    async loadCheckout(){
        this.addMessage("Loading checkout...", "loading")
        let resp = await fetch(`https://www.snipes.${this.d}/checkout?registration=false`, {
            "headers": {
              "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
              "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "same-origin",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1"
            },
            "referrer": `https://www.snipes.${this.d}/view-account?registration=false`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await resp.status
        let respText = await resp.text()
        if (status === 200){
            console.log("Checkout has been loaded")
            this.addMessage("Checkout has been loaded!", "success")
            let checkoutContainer = document.implementation.createHTMLDocument().documentElement;
            checkoutContainer.innerHTML = respText;
            this.shipmentUUID = checkoutContainer.querySelector("input[name*='originalShipmentUUID']").getAttribute("value")
            this.shippingStep()
        } else {
            console.log("Error while loading checkout!")
            this.addMessage("Error while loading checkout!", "failed")
        }
    }

    async shippingStep(){
        if (this.shipmentUUID){
            this.addMessage("Submitting shipping...", "loading")
            let resp = await fetch(`https://www.snipes.${this.domain}/on/demandware.store/${this.locale}/CheckoutShippingServices-SelectShippingMethod?format=ajax`, {
                "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"macOS\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
                },
                "referrer": `https://www.snipes.${this.domain}/checkout`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `methodID=home-delivery_${this.domain}&shipmentUUID=${this.shipmentUUID}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            let status = await resp.status
            let jsonData = await resp.json()

            if (status === 200 && jsonData.addressForm.valid === true){
                console.log("Shipping has been submitted!")
                this.addMessage("Shipping submitted!", "success")
                this.getPayPal()
            } else {
                console.log("Error while submitting shipping!")
                this.addMessage("Error while submitting shipping!", "failed")
            }
        } else {
            console.log("No shipping UUID found!")
            this.addMessage("No shipping UUID found!", "failed")
        }
    }

    async getPayPal(){
        this.addMessage("Submitting order...", "loading")
        let resp = await fetch(`https://www.snipes.${this.domain}/on/demandware.store/${this.locale}/CheckoutServices-PlaceOrder?format=ajax`, {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "it-IT,it;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": `https://www.snipes.${this.domain}/checkout?stage=placeOrder`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
            });
        let status = await resp.status
        let jsonData = await resp.json()

        if (status === 200 && jsonData.error === false){
            let paypalUrl = jsonData.continueUrl
            console.log("Successfully checked out!")
            this.addMessageUrl("Click here to pay!", "success", paypalUrl)
            this.openUrl(paypalUrl)
            this.getItemInfo(paypalUrl)
        } else {
            console.log("Error while submitting order!")
            this.addMessage("Error while submitting order!", "failed")
        }
    }

    async getItemInfo(paypalUrl){
        this.image = document.querySelector("img[class*='b-dynamic_image_content']").getAttribute("data-src")
        this.name = document.querySelector("div[class*='t-product-brand-name']").textContent.trim()
        this.mainName = document.querySelector("span[class*='t-product-main-name']").textContent.trim()
        this.color = document.querySelector("span[class*='t-checkout-attr-value']").textContent.trim()
        this.size = document.querySelectorAll("span[class*='t-checkout-attr-value']")[2].textContent.trim()
        this.cartPrice = document.querySelector("span[class*='t-checkout-price-value']").textContent.trim()

        this.saveHistory()
        this.updateSuccessCount("success")
        this.sendWebhook(paypalUrl)
    }

    async checkShipping(){
        try {
            await Utils.sleep(Utils.getRandomInt(300, 800))
            let checkBtn = document.querySelector("input[id*='dwfrm_shipping_shippingAddress_shippingAddressUseAsBillingAddress']")
            checkBtn.click()
            let shippingBtn = document.querySelector("button[class*='checkout'][value*='submit-shipping']")
            await Utils.sleep(Utils.getRandomInt(300, 800))
            shippingBtn.click()
            this.submitPayment()

        } catch (error) {
            console.log(error)
        }
    }

    async sleep(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async submitPayment(){
        while (true){
            try {
                let paypalBtn = document.querySelector("button[class*='checkout'][value*='place-order']")
                await this.sleep(Utils.getRandomInt(1000, 2500))
                paypalBtn.click()
            } catch (error) {
                console.log(error)
                await this.sleep(Utils.getRandomInt(2500, 7500))
            }
            await this.sleep(Utils.getRandomInt(2500, 6500))
        }
    }

    async checkout(){
        try {
            this.image = document.querySelector("img[class*='b-dynamic_image_content']").getAttribute("data-src")
            this.name = document.querySelector("div[class*='t-product-brand-name']").textContent.trim()
            this.mainName = document.querySelector("span[class*='t-product-main-name']").textContent.trim()
            this.color = document.querySelector("span[class*='t-checkout-attr-value']").textContent.trim()
            this.size = document.querySelectorAll("span[class*='t-checkout-attr-value']")[2].textContent.trim()
            this.cartPrice = document.querySelector("span[class*='t-checkout-price-value']").textContent.trim()
            
            let paypalBtn = document.querySelector("button[class*='checkout'][value*='place-order']")
            await Utils.sleep(Utils.getRandomInt(300, 800))
            if (paypalBtn){
                paypalBtn.click()
                let sendMsg = {
                    pdpImg: this.image,
                    pdpName: this.mainName,
                    pdpColor: this.color,
                    pdpSize: this.size,
                    pdpPrice: this.cartPrice,
                    region: document.URL.split("snipes.")[1].split("/")[0],
                }
                console.log("Awaiting checkout...")
                this.port.postMessage({action: "listen_checkout", data: sendMsg});
                this.messageParser()
            } else {
                Utils.log("No paypal btn has been found!", this.store)
                this.loadCheckout()
            }
        } catch (error) {
            console.log("Error while getting item info!")
        }
    }

    async sendWebhook(paypalUrl){
        console.log("Sending webhooks")
        let privateData = {
            author: {
                name: 'Lollipop ext',
                icon_url: "https://i.imgur.com/4cJK9wD.png",
                url: "https://twitter.com/lollipop_ext"
                },
            title: "Detected a new candy checkout on Snipes!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "Snipes",
                    inline: true,
                },
                {
                    name: "Item",
                    value: this.mainName,
                    inline: true,
                },
                {
                    name: "Color",
                    value: this.color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.size,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: this.cartPrice,
                    inline: true,
                },
                {
                    name: "User",
                    value: this.userName,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: this.snipesMode,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: this.image
            }
        }

        let publicData = {
            author: {
                name: 'Lollipop ext',
                icon_url: "https://i.imgur.com/4cJK9wD.png",
                url: "https://twitter.com/lollipop_ext"
                },
            title: "Detected a new candy checkout on Snipes!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "Snipes",
                    inline: true,
                },
                {
                    name: "Item",
                    value: this.mainName,
                    inline: true,
                },
                {
                    name: "Color",
                    value: this.color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.size,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: this.cartPrice,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: this.snipesMode,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: this.image
            }
        }

        let userData = {
            author: {
                name: 'Lollipop ext',
                icon_url: "https://i.imgur.com/4cJK9wD.png",
                url: "https://twitter.com/lollipop_ext"
                },
            title: "Successfully checked out! Click here to pay!",
            color: 	11644927,
            url: paypalUrl,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "Snipes",
                    inline: true,
                },
                {
                    name: "Item",
                    value: this.mainName,
                    inline: true,
                },
                {
                    name: "Color",
                    value: this.color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.size,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: this.cartPrice,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: this.snipesMode,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: this.image
            }
        }

        chrome.storage.local.get("userSuccessWebhook", (data) => {
            if (data["userSuccessWebhook"] == undefined){
                console.log("User success webhook not found!")
            }
            else {
                new Discord(data["userSuccessWebhook"], userData).switchWebhook()
            }
        })
    }
}


window.onload = () => {
    chrome.storage.sync.get(["snipesStatus"], (result) => {
        if (result["snipesStatus"] && result["snipesStatus"] === "ON"){
            let task = new Snipes("None", document.URL.split("/")[2].split(".")[2])
            task.initCheckout()
        } else {
            console.log("Module off")
        }
    })

}