

class Snipes {
    location = "Snipes"
    dataSizePid = []                
    size = []
    cartedPid = "NaN"
    cartedSize = "NaN"
    regions = {
        "com" : "Sites-snse-DE-AT-Site/de_DE",
        "fr" : "Sites-snse-FR-Site/fr_FR",
        "es" : "Sites-snse-SOUTH-Site/es_ES",
        "be" : "Sites-snse-NL-BE-Site/nl_BE",
        "it" : "Sites-snse-SOUTH-Site/it_IT",
        "nl" : "Sites-snse-NL-BE-Site/nl_NL"
    }
    shipmentUUID
    d
    locale
    userName = "NaN"
    snipesMode = "human-safe"
    snipesDelay = 3000

    constructor(pid, domain, sizeMin, sizeMax){
        this.pid = pid;
        this.domain = domain;
        this.sizeMin = sizeMin;
        this.sizeMax = sizeMax;
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


    async initSnipes(){
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
        
        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                this.getPids()
            } else {
                alert("User not found!")   
            }
        })
    }

    async getPids(){
        if (this.pid.length === 14){
            this.addMessage("Starting normal mode!", "loading")
            document.querySelectorAll('span[class*="b-swatch-value--orderable"]').forEach(elem => {
                if (this.sizeMin <= elem.getAttribute('data-attr-value') && elem.getAttribute('data-attr-value') <= this.sizeMax){
                    this.size.push(elem.getAttribute('data-attr-value'))
                }
            })
            for (let index = 0; index < this.size.length; index++) {
                var pid = document.querySelector('a[class*="js-pdp-attribute-btn b-pdp-swatch-link js-pdp-attribute-btn--size"][data-value*="'+this.size[index]+'"]').getAttribute('data-variant-id')
                this.dataSizePid.push(`${this.pid}${pid.slice(14)}`)
            }
            if (this.dataSizePid.length != 0){
                this.addMessage("Stock has been found!", "success")
                console.log(this.dataSizePid)
                var random = Utils.getRandomInt(0, this.dataSizePid.length-1)
                this.cartedPid = this.dataSizePid[random]
                this.cartedSize = this.size[random]
                this.addToCart()
            } else {
                this.addMessage("Product out of stock", "failed")
            }

        } else {
            this.addMessage("Starting pid mode!", "loading")
            this.cartedPid = this.pid;
            this.addToCart()
        }
    }

    async addToCart(){
        if (this.cartedPid){
            this.addMessage("Adding to cart...", "loading")
            this.d = this.domain[this.domain.length-1];
            this.locale = this.regions[this.d]
            let atcData
            if (this.cartedSize != "NaN"){
                atcData = 'pid=' + this.cartedPid + `&options:[{"optionId":"size","selectedValueId":"${this.cartedSize}"}]`+'&quantity=1';
            } else {
                atcData = 'pid=' + this.cartedPid + `&options:[{"optionId":"size","selectedValueId":"RANDOM"}]`+'&quantity=1';
            }
            let newAtcData = `pid=${this.cartedPid}&options=&quantity=1`

            let resp = await fetch(`https://www.snipes.${this.d}/add-product?format=ajax`, {
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
                "referrer": "https://www.snipes.it/cart",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": newAtcData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            let status = await resp.status
            let responseData = await resp.json()

            if (status === 200 && responseData){
                if (responseData.quantityTotal != 0 && responseData.error != true){
                    this.addMessage("Added to cart!", "success")
                    if (this.snipesMode.includes("human")){
                        location.href = `https://www.snipes.${this.d}/checkout?stage=placeOrder#placeOrder`
                    } else {
                        this.loadCheckout()
                    }
                } else {
                    this.addMessage("Error in ATC. Retrying...", "failed")
                    await Utils.sleep(this.snipesDelay)
                    this.addToCart()
                }
            } else {
                this.addMessage("Error in ATC. Retrying...")

                await Utils.sleep(this.snipesDelay)
                this.addToCart()
            }
        }
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
            let resp = await fetch(`https://www.snipes.it/on/demandware.store/${this.locale}/CheckoutShippingServices-SelectShippingMethod?format=ajax`, {
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
                "referrer": `https://www.snipes.${this.d}/checkout`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `methodID=home-delivery_${this.d}&shipmentUUID=${this.shipmentUUID}`,
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
        let resp = await fetch(`https://www.snipes.${this.d}/on/demandware.store/${this.locale}/CheckoutServices-PlaceOrder?format=ajax`, {
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
            "referrer": `https://www.snipes.${this.d}/checkout?stage=placeOrder`,
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

    async openUrl(url){
        let w = 600
        let h = 600
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
    }

    async getItemInfo(paypalUrl){
        let image = document.querySelectorAll("div[class*='b-pdp-carousel-item js-pdp-carousel-item']")[1].querySelector("img[class*='b-dynamic_image_content']").getAttribute("src")
        let info = JSON.parse(document.querySelector("div[data-cmp='productMgr']").getAttribute("data-gtm"))
        this.sendWebhook(image, info, paypalUrl)
        this.saveHistory(image, info)
        this.updateSuccessCount("success")
    }

    async sendWebhook(image, info, paypalUrl){

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
                    value: info.name,
                    inline: true,
                },
                {
                    name: "Color",
                    value: info.dimension25,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.cartedSize,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: info.price,
                    inline: true,
                },
                {
                    name: "User",
                    value: this.userName,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: "Request",
                    inline: true,
                }
            ], 
            thumbnail: {
                url: image
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
                    value: info.name,
                    inline: true,
                },
                {
                    name: "Color",
                    value: info.dimension25,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.cartedSize,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: info.price,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: "Request",
                    inline: true,
                }
            ], 
            thumbnail: {
                url: image
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
                    value: info.name,
                    inline: true,
                },
                {
                    name: "Color",
                    value: info.dimension25,
                    inline: true,
                },
                {
                    name: "Size",
                    value: this.cartedSize,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: info.price,
                    inline: true,
                },
                {
                    name: "Mode",
                    value: "||Request||",
                    inline: true,
                }
            ], 
            thumbnail: {
                url: image
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

    async saveHistory(image, info){
        chrome.storage.local.get(["userSuccess"], (result) => {
            if (result["userSuccess"]){
                let jsonData = JSON.parse(result["userSuccess"])
                let newData = {
                    image: image,
                    store: "Snipes",
                    name: info.name,
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
                        image: image,
                        store: "Snipes",
                        name: info.name,
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
}


window.onload = () => {
    chrome.storage.sync.get(["snipesStatus"], (result) => {
        if (result["snipesStatus"] && result["snipesStatus"] === "ON"){
            startModule()
        } else {
            console.log("Module off")
        }
    })
}


async function startModule(){
    let snipesMin
    let snipesMax

    chrome.storage.sync.get(["snipesMin"], (resultMin) => {
        if (resultMin["snipesMin"]){
            snipesMin = parseFloat(resultMin["snipesMin"])
            chrome.storage.sync.get(["snipesMax"], (resultMax) => {
                if (resultMax["snipesMax"]){
                    snipesMax = parseFloat(resultMax["snipesMax"])
                    let task = new Snipes(document.URL.split("-")[document.URL.split("-").length-1].split(".")[0], document.URL.split('//')[1].split('/')[0].split('.'), snipesMin, snipesMax)
                    task.injectConsole()
                    task.initSnipes()
                } else {
                    console.log("No snipesMax has been found!")
                    alert("No snipesMax has been found!")
                }
            })
        } else {
            console.log("No snipes min has been found!")
            alert("No snipes min has been found!")
        }
    })
}
