class LVR {
    location = "LVR"
    port;
    userName
    removeListenerFunctions = []

    SeasonId
    CollectionId
    ItemId
    VendorColorId
    SizeTypeId
    SizeId
    ComColorId
    CartId
    addressInfo
    cartedInfo
    rows
    email
    availableSize = []

    constructor(sizeMin, sizeMax){
        this.sizeMin = sizeMin
        this.sizeMax = sizeMax
        this.port = chrome.runtime.connect({ name: 'lvr' });
    }

    async injectConsole(){
        if (document.querySelector("form[id='challengeForm']")){
            console.log("Captcha found...")
        } else {
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

    async init(){
        console.log("Starting module")
        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                this.getItemInfo()
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async getItemInfo(){
        /**
         * Create a random string (eg. 'jkd8ahvklna4ij').
         * This string will be the name of the event I dispatch from the service worker.
         * Basically the way how I can send a message from the Service worker to the Content Script
         */

        const randomEventName = Utils.makeid(15);
        document.addEventListener(randomEventName, async (e) => {
            /**
             * In the service worker I create a new event with 'new CustomEvent'.
             * Inside this custom event I put the data i want to send to the ContentScript
             * You can extract it like so:
             */
            console.log(e.detail)
            this.parseItemData(e.detail)
        });

        /**
         * Send a message to the ServiceWorker that will call the 'getWindowProperty' function.
         * The first parameter is the property I want to read from the window object
         * The second property is the random string I created earlier (so it knows which name the event needs to have)
         */
        this.port.postMessage({ action: "getData", dataName: 'window.__BODY_MODEL__', event: randomEventName});
    }

    async parseItemData(jsonData){
        try {
            this.CollectionId = jsonData.ItemParameters.CollectionId
            this.ItemId = jsonData.ItemParameters.ItemId
            this.SeasonId = jsonData.ItemParameters.SeasonId
            this.VendorColorId = jsonData.ItemParameters.VendorColorId

            jsonData.Availability.forEach(elem => {
                if (elem.ColorAvailability[0].QuantitiesTotal.IsAvailable === true){
                    this.ComColorId = elem.ColorAvailability[0].ComColorId
                    if (this.sizeMin <= elem.SizeId && elem.SizeId <= this.sizeMax){
                        let data = {
                            SizeId: elem.SizeId,
                            SizeTypeId: elem.SizeTypeId
                        }
                        this.availableSize.push(data)
                    } else {
                        console.log("Size not in range")
                        try {
                            console.log(this.sizeMin, elem.SizeId, this.sizeMax)
                        } catch (error) {
                            console.log(error)
                        }
                    }
                } else {
                    console.log("Size not available")
                }
            })
            if (this.availableSize.length != 0){
                console.log("Stock has been found!")
                this.addMessage("Stock has been found!", "success")
                this.addToCart()
            } else {
                console.log("No stock has been found!")
                this.addMessage("Product OOS", "failed")
            }
        } catch (error) {
            this.addMessage("Product info error!", "failed")
        }
    }

    async addToCart(){
        this.addMessage("Adding to cart...", "loading")
        var random = Utils.getRandomInt(0, this.availableSize.length-1)
        this.cartedInfo = this.availableSize[random]

        let atcData = {
            "SeasonId": this.SeasonId,
            "CollectionId": this.CollectionId,
            "ItemId": this.ItemId,
            "VendorColorId": this.VendorColorId,
            "SizeTypeId": this.cartedInfo.SizeTypeId,
            "SizeId": this.cartedInfo.SizeId,
            "Quantity": 1,
            "IsMobile": false
          }

        let response = await fetch("https://www.luisaviaroma.com/myarea/bag/add", {
            "headers": {
                "accept": "*/*",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "cache-control": "max-age=0",
                "content-type": "application/json",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-lvr-requested-with": "bag/add",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": document.URL,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(atcData),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()

        if (status === 200 && jsonData.Error === "None"){
            console.log("Item has been carted")
            this.addMessage("Added to cart!", "success")
            this.CartId = jsonData.ListResponse.OrderInfo.CartId
            this.rows = jsonData.ListResponse.OrderInfo.Rows
            this.email = jsonData.ListResponse.UserInfo.Id
            this.getAddress()
        } else {
            console.log("Error while adding to cart!")
            this.addMessage("Error while adding to cart!", "failed")
        }
    }


    async getAddress(){
        this.addMessage("Getting profile...", "loading")
        let response = await fetch("https://www.luisaviaroma.com/myarea/usersession/getaddresses", {
            "headers": {
                "accept": "*/*",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "cache-control": "max-age=0",
                "content-type": "application/json",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.luisaviaroma.com/myarea/myCart.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()
        if (status === 200 && jsonData){
            if (jsonData.Code === "Success"){
                this.addressInfo = jsonData.Addresses[0]
                this.checkout()
            } else {
                console.log("Error while getting the address")
                this.addMessage("Error while getting profile!", "failed")
            }
        }
    }

    async checkout(){
        this.addMessage("Submitting order...", "loading")
        let ShipAddress = {
            "AddressID": this.addressInfo.AddressID, // dati da prendere
            "FirstName": this.addressInfo.FirstName,
            "LastName": this.addressInfo.LastName,
            "Phone": this.addressInfo.Phone,
            "CountryId": this.addressInfo.CountryID,
            "Address": this.addressInfo.Address,
            "ZipCode": this.addressInfo.ZipCode,
            "City": this.addressInfo.City,
            "StateId": this.addressInfo.ProvID,
            "CodFisc": null,
            "PecDestinatario": null,
            "CodDestinatario": null
        }

        let BillAddress = { // dati da prendere
            "AddressID": this.addressInfo.AddressID,
            "FirstName": this.addressInfo.FirstName,
            "LastName": this.addressInfo.LastName,
            "Phone": this.addressInfo.Phone,
            "CountryId": this.addressInfo.CountryID,
            "Address": this.addressInfo.Address,
            "ZipCode": this.addressInfo.ZipCode,
            "City": this.addressInfo.City,
            "StateId": this.addressInfo.ProvID,
            "CodFisc": null,
            "PecDestinatario": null,
            "CodDestinatario": null
        }

        let email = ""
        try {
            email = document.querySelector("input[id='Email']").getAttribute("value")
        } catch (error) {
            console.log("User not logged in!")
            alert("Plese, log in into your account!")
        }

        let createOrderData = {
            "IsMobile": false,
            "ConfirmUser": {
                "Account": { // dati da prendere
                    "Email": email,
                    "FirstName": this.addressInfo.FirstName,
                    "LastName": this.addressInfo.LastName,
                    "SubscribeNewsLetter": false,
                    "SubscribeLoyalty": false,
                    "Password": ""
                },
                "ShipAddress": ShipAddress,
                "BillAddress": BillAddress,
                "PaymentCode": "PPA",
                "ShippingTypeService": "E",
                "InvoiceRequested": false
            },
            "CreateOrder": {
                "type": "loggeduser",
                "Account": {
                    "Email": email, // dati da pendere
                    "FirstName": this.addressInfo.FirstName,
                    "LastName": this.addressInfo.LastName,
                    "SubscribeNewsLetter": false,
                    "SubscribeLoyalty": false,
                    "Password": ""
                },
                "ShipAddress": ShipAddress,
                "BillAddress": BillAddress,
                "ShippingTypeService": "E",
                "PaymentCode": "PPA",
                "AcceptPayPalBillingAgreement": true,
                "CreditCard": "PPA",
                "PromoPaymentCode": null,
                "Promos": [
                    { Type: 6, Code: "NGG40" },
                    { Type: 6, Code: "FURTHER30" },
                    { Type: 6, Code: "FURTHER25" },
                    { Type: 6, Code: "FSMAR" },
                    { Type: 6, Code: "FURTHER10" },
                    { Type: 6, Code: "FURTHER20" },
                    { Type: 6, Code: "KARTELL15" },
                    { Type: 6, Code: "HOME25" },
                    { Type: 6, Code: "KARTELL20" },
                    { Type: 6, Code: "HOME40" },
                    { Type: 6, Code: "BEAUTY25" },
                    { Type: 6, Code: "PPP25" },
                    { Type: 6, Code: "BEAUTY10" },
                    { Type: 6, Code: "HOME10" },
                    { Type: 6, Code: "HOME15" },
                    { Type: 6, Code: "HOME20" },
                    { Type: 6, Code: "HOME30" },
                    { Type: 6, Code: "PPP30" },
                    { Type: 6, Code: "PPP20" },
                    { Type: 6, Code: "BEAUTY15" },
                    { Type: 6, Code: "BEAUTY20" },
                    { Type: 6, Code: "BEAUTY40" },
                    { Type: 6, Code: "BEAUTY50" },
                    { Type: 6, Code: "BEAUTY30" },
                ],
                "Rows": this.rows,
                "IsGuest": false,
                "CartId": this.CartId, // da prendere
                "FattCurrencyId": "EUR",
                "ViewCurrencyId": "EUR",
                "Language": "IT",
                "Mobile": false,
                "ShippingCost": 0,
                "ShippingAgent": "",
                "InvoiceRequested": false,
                "SalesTaxes": 0
            }
        }

        let response = await fetch("https://www.luisaviaroma.com/myarea/bag/confirmloggeduserandcreateorder", {
            "headers": {
                "accept": "*/*",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "cache-control": "max-age=0",
                "content-type": "application/json",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-lvr-requested-with": "checkout/confirmloggeduserandcreateorder",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.luisaviaroma.com/myarea/myCart.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(createOrderData),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()

        if (status === 200 && jsonData.Error === "None"){
            console.log("Successfully checked out!")
            this.parseCheckout(jsonData)
            this.updateSuccessCount("success")
        } else {
            console.log("Error while checking out!")
            this.updateSuccessCount("failed")
            this.addMessage("Error while checking out!", "failed")
        }
    }

    async parseCheckout(checkoutData){
        let description = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Description
        let sku = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Code
        let color = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Color
        let size = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Size
        let qty = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Quantity
        let price = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Price.PriceView
        let image = checkoutData.ConfirmUserResponse.ListResponse.Rows[0].Photo
        let paypalUrl = checkoutData.CreateOrderResponse.Action.Url


        try {
            chrome.storage.local.get(["userSuccess"], (result) => {
                if (result["userSuccess"]){
                    let jsonData = JSON.parse(result["userSuccess"])
                    let newData = {
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuu--3SwBBmETAHnEmRbpDcKGFRuTPXUjoB1-vu0U4lij7SLjR2erfdyfceiC06_CwRS8&usqp=CAU",
                        store: "LVR",
                        name: description,
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
                                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuu--3SwBBmETAHnEmRbpDcKGFRuTPXUjoB1-vu0U4lij7SLjR2erfdyfceiC06_CwRS8&usqp=CAU",
                                store: "LVR",
                                name: description,
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


        this.addMessageUrl("Click here to pay!", "success", paypalUrl)
        this.openUrl(paypalUrl)

        let privateData = {
            author: {
                name: 'Lollipop ext',
                icon_url: "https://i.imgur.com/4cJK9wD.png",
                url: "https://twitter.com/lollipop_ext"
                },
            title: "Detected a new candy checkout on LVR!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "LVR",
                    inline: true,
                },
                {
                    name: "Item",
                    value: description,
                    inline: true,
                },
                {
                    name: "Color",
                    value: color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: size,
                    inline: true,
                },
                {
                    name: "Sku",
                    value: sku,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: price,
                    inline: true,
                },
                {
                    name: "User",
                    value: this.userName,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: `https:${image}`
            }
        }

        let publicData = {
            author: {
                name: 'Lollipop ext',
                icon_url: "https://i.imgur.com/4cJK9wD.png",
                url: "https://twitter.com/lollipop_ext"
                },
            title: "Detected a new candy checkout on LVR!",
            color: 	11644927,
            timestamp: new Date().toISOString(),
            footer: {
                text: "LollipopEXT - 0.3"
            },
            fields: [
                // you can add other fields
                {
                    name: "Site",
                    value: "LVR",
                    inline: true,
                },
                {
                    name: "Item",
                    value: description,
                    inline: true,
                },
                {
                    name: "Color",
                    value: color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: size,
                    inline: true,
                },
                {
                    name: "Sku",
                    value: sku,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: price,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: `https:${image}`
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
                    value: "LVR",
                    inline: true,
                },
                {
                    name: "Item",
                    value: description,
                    inline: true,
                },
                {
                    name: "Color",
                    value: color,
                    inline: true,
                },
                {
                    name: "Size",
                    value: size,
                    inline: true,
                },
                {
                    name: "Sku",
                    value: sku,
                    inline: true,
                },
                {
                    name: "Cart price",
                    value: price,
                    inline: true,
                }
            ], 
            thumbnail: {
                url: `https:${image}`
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

        let productInfo = {
            userName: this.userName,
            item: `${description}, ${color}`,
            size: size,
            sku: sku,
            cartPrice: price
        }
        this.port.postMessage({ action: "saveStats", productInfo: productInfo });
    }

    async openUrl(url){
        let w = 600
        let h = 600
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open(url, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
    }

    async updateSuccessCount(type){
        if (type === "failed") {
            chrome.storage.local.get("userFailedWebhook", data => {
                if (data.userFailedWebhook) {
                    new Discord(data.userFailedWebhook, {
                        title: "LuisaViaRoma checkout failed",
                        timestamp: new Date().toISOString()
                    }).switchWebhook()
                }
            })
        }
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
}


window.onload = () => {
    chrome.storage.sync.get(["lvrStatus"], (result) => {
        if (result["lvrStatus"] && result["lvrStatus"] === "ON"){
            console.log("Starting lvr...")
            startLvr()
        } else {
            console.log("Module offline!")
        }
    })
} 


async function startLvr(){
    let lvrMin
    let lvrMax
    chrome.storage.sync.get(["lvrMin"], (result) => {
        if (result["lvrMin"]){
            lvrMin = parseFloat(result["lvrMin"])
            chrome.storage.sync.get(["lvrMax"], (result) => {
                if (result["lvrMax"]){
                    lvrMax = parseFloat(result["lvrMax"])
                    console.log(lvrMin, lvrMax)
                    let task = new LVR(lvrMin, lvrMax)
                    task.injectConsole()
                    task.init()
                } else {
                    alert("No lvr max has been found!")
                }
            })
        } else {
            alert("No lvr min has been found!")
        }
    })
}
