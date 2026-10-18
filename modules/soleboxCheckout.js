class Solebox {
    location = "Solebox checkout"
    port;
    image = "https://www.solebox.com/on/demandware.static/Sites-solebox-Site/-/default/dwe95d97ec/images/solebox_logo.svg"
    name = ""
    mainName = ""
    color = ""
    size = ""
    cartPrice = ""

    userName = ""
    userWebhook = ""

    removeListenerFunctions = []

    constructor(sku){
        this.sku = sku;
        this.port = chrome.runtime.connect({ name: 'solebox' });
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

    async updateHistory(){
        try {
            chrome.storage.local.get(["userSuccess"], (result) => {
                if (result["userSuccess"]){
                    let jsonData = JSON.parse(result["userSuccess"])
                    let newData = {
                        image: this.image,
                        store: "Solebox",
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
                        data: [
                            {
                                image: this.image,
                                store: "Solebox",
                                name: this.mainName,
                                date: Utils.getCurrentDate()
                            }
                        ]
                    }
                    chrome.storage.local.set({
                        ["userSuccess"] : JSON.stringify(jsonData)
                    }, function() {
                        console.log("Success has been updated!")
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    async messageParser(){
        let callback = async (details) => {
            if (details.msg){
                if (details.url){
                    //this.addMessageUrl(details.msg, details.status, details.url)
                    if (details.url.includes("paypal")){
                        this.port.postMessage({action: "sendWebhook", data: details.url});
                        this.openUrl(details.url)
                        this.sendWebhook(details.url)
                        this.updateHistory()
                        this.updateSuccessCount("success")
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
                this.checkout()
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async checkShipping(){
        try {
            await Utils.sleep(Utils.getRandomInt(300, 800))
            let toggle = document.querySelector("span[class*='f-custom-radio-button']").click()
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
                await this.sleep(Utils.getRandomInt(1000, 2500))
            }
        }
    }

    async checkout(){
        try {
            this.image = document.querySelector("img[class*='b-dynamic_image_content']").getAttribute("src")
            this.name = document.querySelector("div[class*='t-product-brand-name']").textContent.trim()
            this.mainName = document.querySelector("span[class*='t-product-main-name']").textContent.trim()
            this.size = document.querySelector("span[class*='t-checkout-attr-value']").textContent.trim()
            this.color = document.querySelectorAll("span[class*='t-checkout-attr-value']")[2].textContent.trim()
            this.cartPrice = document.querySelectorAll("span[class*='t-checkout-price-value']")[4].textContent.trim()
            
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
                    region: "com",
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
            title: "Detected a new candy checkout on Solebox!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "Solebox",
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
                    name: "Checkout price",
                    value: this.cartPrice,
                    inline: true,
                },
                {
                    name: "User",
                    value: this.userName,
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
            title: "Detected a new candy checkout on Solebox!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "Solebox",
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
                    name: "Checkout price",
                    value: this.cartPrice,
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
                    value: "Solebox",
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
                    name: "Checkout price",
                    value: this.cartPrice,
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
    chrome.storage.sync.get(["soleboxStatus"], (result) => {
        if (result["soleboxStatus"] && result["soleboxStatus"] === "ON"){
            let task = new Solebox()
            task.initCheckout()
        } else {
            console.log("Module off")
        }
    })
}
