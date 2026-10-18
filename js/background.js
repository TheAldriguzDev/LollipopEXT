class Background {
    location = "Background"

    constructor (port){
        this.port = port
    }

    shutDownBackground(){
        console.log("Closing connection with the port")
        try {
            this.port.disconnect()
        } catch (error) {
            console.log("Error while disconnecting the port!")
            alert("Errro while disconnecting the port!")
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
    }

    sleepFunc (ms) { 
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async saveStats(store, checkoutData){
        // The original remote analytics service depended on a removed embedded key.
        // Keep the legacy call sites inert; existing local counters are managed separately.
    }

    async notifyFailure(store){
        const { userFailedWebhook } = await chrome.storage.local.get("userFailedWebhook");
        if (!userFailedWebhook) return;
        await fetch(userFailedWebhook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ embeds: [{ title: `${store} checkout failed`, timestamp: new Date().toISOString() }] })
        });
    }

}

class Airness extends Background {
    location = "Airness Bg"
    sku;
    pids = [];
    restockPids = [];
    token = "";
    image;
    name;
    cartToken;
    cartedSize;
    cartedQty;
    selectShippingID;
    successWebhook = ""
    failedWebhook = ""
    userName = ""
    sizeMin = 33
    sizeMax = 50
    profileInfo
    start
    end
    mode

    constructor (port){
        super(port)
    }

    async portListener(){
        this.port.onMessage.addListener((msgData) => {
            if (msgData.action){
                switch (msgData.action){
                    case "start_module":
                        this.sku = msgData.sku
                        this.profileInfo = msgData.profileInfo
                        this.mode = msgData.mode
                        this.initModule()
                        break;
                    default:
                        console.log("Airness action not found!")
                        break;
                }
            } else {
                console.log("Error, action not found!")
            }
        })
    }

    async initModule(){
        chrome.storage.local.get("userSuccessWebhook", (data) => {
            if (data["userSuccessWebhook"] == undefined){
                console.log("User success webhook not found!")
            }
            else {
                this.successWebhook = data["userSuccessWebhook"]
            }
        })
    
        chrome.storage.local.get("userFailedWebhook", (data) => {
            if (data["userFailedWebhook"] == undefined){
                console.log("User failed webhook not found!")
            }
            else {
                this.failedWebhook = data["userFailedWebhook"]
            }
        })

        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                this.generateToken()
                this.start = Date.now()
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async generateToken(){
        this.port.postMessage({msg: "Generating token...", status: "loading"});

        let response = await fetch("https://airness-2.commercelayer.io/oauth/token", {
            "headers": {
                "accept": "application/json, application/x-www-form-urlencoded",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": "Basic b01tNXJtOGdOZDJoS01UZHZfZGMxSFd4Q1BPZXBrZHRHd2FxLWFiczhudzo=",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://airness-2.commercelayer.io/oauth/token",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "grant_type=client_credentials&scope=market%3A2392",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()

        if (status === 200 && jsonData){
            if (jsonData){
                try {
                    this.access_token = jsonData.access_token
                    this.port.postMessage({msg: "Token has been generated", status: "success"});
                    this.getPids()
                } catch (error) {
                    this.port.postMessage({msg: "Error while generating the token!", status: "failed"});
                }
            } else {
                this.port.postMessage({msg: "Error while generating the token!", status: "failed"});
            }
        } else {
            this.port.postMessage({msg: "Error while generating the token!", status: "failed"});
        }
    }

    async getPids(){
        let response = await fetch(`https://airness-2.commercelayer.io/api/skus?filter[q][reference_eq]=${this.sku}&page[number]=1,2&page[size]=25`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
            },
            "referrer": `https://airness-2.commercelayer.io/api/skus?filter[q][reference_eq]=${this.sku}&page[number]=1,2&page[size]=25`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()
        if (status === 200 && jsonData){
            this.image = jsonData.data[0].attributes.image_url
            this.name = jsonData.data[0].attributes.metadata.PNAME
            jsonData.data.forEach(elem => {
                let size = parseFloat(elem.attributes.metadata.EU);
                console.log(this.sizeMin)
                if (this.sizeMin <= size && size <= this.sizeMax){
                    let info = {
                        pid: elem.id,
                        size: size
                    }
                    this.pids.push(info)
                    this.restockPids.push(info)
                }
            })
            if (this.pids.length != 0){
                this.port.postMessage({msg: "Pids has been found!", status: "loading"});
                this.getStock()
            } else {
                this.port.postMessage({msg: "Error while getting the pids!", status: "failed"});
            }
        } else {
            this.port.postMessage({msg: "Error while getting the pids!", status: "failed"});
        }
    }

    async getStock(){
        let i = 0;
        for(let pidInfo of this.pids){
            let response = await fetch(`https://airness-2.commercelayer.io/api/skus/${pidInfo.pid}?include=stock_items`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                    "authorization": `Bearer ${this.access_token}`,
                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                },
                "referrer": `https://airness-2.commercelayer.io/api/skus/${pidInfo.pid}?include=stock_items`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            let status = await response.status
            let jsonData = await response.json()

            if (status === 200 && jsonData){
                if (jsonData.data.attributes.inventory.quantity != 0){
                    try {
                        this.pids[i]["stock"] = jsonData.data.attributes.inventory.quantity
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            i++;
        }
        if (this.pids){
            this.pids = this.pids.filter((elem) => {
                return elem.stock;
            })
            if (this.pids.length != 0){
                this.port.postMessage({msg: "Stock has been found!", status: "loading"});
                this.addToCart()
            } else {
                // add restock mode
                this.port.postMessage({msg: "No stock has been found!", status: "failed"});
            }
        }
    }

    async generateCartToken(){
        this.port.postMessage({msg: "Generating cart token...", status: "loading"});
        return new Promise(async (resolve, rejects) => {
            let response = await fetch(`https://airness-2.commercelayer.io/api/orders`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
                    "authorization": `Bearer ${this.access_token}`,
                    "content-type": "application/vnd.api+json",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                },
                "referrer": `https://airness-2.commercelayer.io/api/orders`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"data\":{\"type\":\"orders\",\"attributes\":{\"language_code\":\"it\",\"cart_url\":\"https://airness.eu/it/checkout/carrello\",\"return_url\":\"https://airness.eu/it/checkout/ordine-completato\",\"terms_url\":\"https://airness.eu/it/condizioni-di-vendita\",\"privacy_url\":\"https://airness.eu/it/privacy-policy\"}}}",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
    
            let status = await response.status
            let jsonData = await response.json()
    
            if (status === 201 && jsonData){
                resolve(jsonData.data.id)
                //this.port.postMessage({msg: "Cart token has been generated!"});
            } else {
                this.port.postMessage({msg: "Error while generating the cart token!", status: "failed"});
                rejects(0)
            }
        })
    }
    
    async addToCart(){
        let random = this.getRandomInt(0, this.pids.length-1)
        let cartToken = await this.generateCartToken()
        this.cartToken = cartToken;
        if (cartToken === 0){
            await this.sleep(1000)
            this.addToCart()
        } else {
            let qty;
            if (this.mode.includes("single-cart")){
                qty = 1;
            } else {
                qty = this.pids[random].stock
            }
            this.cartedQty = qty
            this.cartedSize = this.pids[random].size.toString()
            this.port.postMessage({msg: "Adding to cart...", status: "loading"});

            let payload = {
                data: {
                    type: "line_items",
                    attributes: {
                        quantity: qty,
                        metadata: {
                            sku: this.sku,
                            description: {
                                data: {},
                                nodeType: "document",
                            },
                            outlet: false,
                            eco: false,
                            restockable: false,
                        },
                    },
                    relationships: {
                        order: {
                            data: {
                                type: "orders",
                                id: cartToken,
                            },
                        },
                        item: {
                            data: {
                                type: "skus",
                                id: this.pids[random].pid,
                            },
                        },
                    },
                },
            };

            let response = await fetch(`https://airness-2.commercelayer.io/api/line_items`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                    "authorization": `Bearer ${this.access_token}`,
                    "content-type": "application/vnd.api+json",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "none",
                },
                "referrer": `https://airness-2.commercelayer.io/api/line_items`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify(payload),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            let status = await response.status
            let jsonData = await response.json()

            if (status === 201 && jsonData){
                let checkoutSession = `https://checkout-22.airness.eu/${cartToken}?accessToken=${this.access_token}` 
                this.port.postMessage({msg: `Checkout session generated`, status: "success", url: checkoutSession});

                let publicData = {
                    embeds: [{
                        author: {
                            name: 'Lollipop ext',
                            icon_url: "https://i.imgur.com/4cJK9wD.png",
                            url: "https://twitter.com/lollipop_ext"
                            },
                        title: "Successfully generated Airness checkout!",
                        color: 	11855103,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "LollipopEXT - 0.3"
                        },
                        fields: [
                            // you can add other fields
                            {
                                name: "Site",
                                value: "Airness",
                                inline: true,
                            },
                            {
                                name: "Item",
                                value: this.name,
                                inline: true,
                            },
                            {
                                name: "Sku",
                                value: this.sku,
                                inline: true,
                            },
                            {
                                name: "Size",
                                value: this.pids[random].size.toString(),
                                inline: true,
                            },
                            {
                                name: "Quantity",
                                value: qty.toString(),
                                inline: true,
                            },
                            {
                                name: "Mode",
                                value: this.mode,
                                inline: true,
                            }
                        ], 
                        thumbnail: {
                            url: this.image
                        }
                    }]
                };

                let userData = {
                    embeds: [{
                        author: {
                            name: 'Lollipop ext',
                            icon_url: "https://i.imgur.com/4cJK9wD.png",
                            url: "https://twitter.com/lollipop_ext"
                            },
                        title: "Click here to load checkout!",
                        color: 	11855103,
                        url: checkoutSession,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "LollipopEXT - 0.3"
                        },
                        fields: [
                            {
                                name: "Site",
                                value: "Airness",
                                inline: true,
                            },
                            {
                                name: "Item",
                                value: this.name,
                                inline: true,
                            },
                            {
                                name: "Sku",
                                value: this.sku,
                                inline: true,
                            },
                            {
                                name: "Size",
                                value: this.pids[random].size.toString(),
                                inline: true,
                            },
                            {
                                name: "Quantity",
                                value: qty.toString(),
                                inline: true,
                            },
                            {
                                name: "Mode",
                                value: this.mode,
                                inline: true,
                            }
                        ], 
                        thumbnail: {
                            url: this.image
                        }
                    }]
                };

                let privateData = {
                    embeds: [{
                        author: {
                            name: 'Lollipop ext',
                            icon_url: "https://i.imgur.com/4cJK9wD.png",
                            url: "https://twitter.com/lollipop_ext"
                            },
                        title: "Successfully generated Airness checkout!",
                        color: 	11855103,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "LollipopEXT - 0.3"
                        },
                        fields: [
                            // you can add other fields
                            {
                                name: "Site",
                                value: "Airness",
                                inline: true,
                            },
                            {
                                name: "Item",
                                value: this.name,
                                inline: true,
                            },
                            {
                                name: "Sku",
                                value: this.sku,
                                inline: true,
                            },
                            {
                                name: "Size",
                                value: this.pids[random].size.toString(),
                                inline: true,
                            },
                            {
                                name: "Quantity",
                                value: qty.toString(),
                                inline: true,
                            },
                            {
                                name: "Mode",
                                value: this.mode,
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
                    }]
                };
                this.sendWebhook(this.successWebhook, userData)

                this.sendEmail()


            } else {
                this.port.postMessage({msg: "Error while adding to cart!", status: "failed"});
            }
        }
    }

    async sendEmail(){
        let emailPayload = {
            "data": {
                "type": "orders",
                "attributes": {
                "customer_email": this.profileInfo.email
            },
                "relationships": {},
                "id": this.cartToken
            }
        }
        let response = await fetch(`https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(emailPayload),
            "method": "PATCH",
            "mode": "cors",
            "credentials": "include"
        });
        let status = await response.status
        if (status === 200){
            this.port.postMessage({msg: "Email has been sent!", status: "success"});
            this.sendShipping()
        } else {
            this.port.postMessage({msg: "Error while sending the email!", status: "failed"});
        }
    }

    async sendShipping(){
        this.port.postMessage({msg: "Submitting shipping...", status: "loading"});
        let shippingPayload = {
            data: {
                type: "addresses",
                attributes: {
                    first_name: this.profileInfo.firstName,
                    last_name: this.profileInfo.lastName,
                    line_1: this.profileInfo.street + this.profileInfo.houseNumber,
                    city: this.profileInfo.city,
                    country_code: this.profileInfo.country,
                    state_code: this.profileInfo.state,
                    zip_code: this.profileInfo.postalCode,
                    phone: this.profileInfo.phone,
                },
                relationships: {},
            },
        };

        let response = await fetch(`https://airness-2.commercelayer.io/api/addresses`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/addresses`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(shippingPayload),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        let status = await response.status
        let jsonData = await response.json()
        if (status === 201){
            let shippingId = jsonData.data.id
            this.sendBilling(shippingId)
        } else {
            this.port.postMessage({msg: "Error while submitting shipping!", status: "failed"});
        }
    }

    async sendBilling(shippingId){
        let billingPayload = {
            data: {
                type: "orders",
                attributes: { _shipping_address_same_as_billing: true },
                relationships: {
                    billing_address: {
                        data: { id: shippingId, type: "addresses" },
                    },
                },
                id: this.cartToken,
            },
        }; 

        let response = await fetch(`https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(billingPayload),
            "method": "PATCH",
            "mode": "cors",
            "credentials": "include"
        });
        let status = await response.status
        let jsonData = await response.json()
        if (status === 200){
            this.port.postMessage({msg: "Shipping has been sent!", status: "success"});
            this.selectShippingID = jsonData.data.relationships.shipments.data[0].id
            this.sendIntegration()
        } else {
            this.port.postMessage({msg: "Error while submitting billing!", status: "failed"});
        }
    }

    async sendIntegration(){
        let integrationPayload = {
            data: {
                env: false,
                data: {
                    type: "orders",
                    id: this.cartToken,
                    attributes: {},
                },
                context: {
                    slug: "airness-2",
                    domain: "commercelayer.io",
                    orderId: this.cartToken,
                },
            },
        };

        let response = await fetch(`https://nodered.quammbase.it/integration-order`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://nodered.quammbase.it/integration-order`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(integrationPayload),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });

        let status = await response.status
        if (status === 200){
            this.port.postMessage({msg: "Integration has been sent!", status: "success"});
            this.initialisePaypal()
        } else {
            this.port.postMessage({msg: "Server error! Skipping request...", status: "failed"});
            this.initialisePaypal()
        }
    }

    async initialisePaypal(){
        let paypalPayload = {
            data: {
                type: "orders",
                attributes: {},
                relationships: {
                    payment_method: {
                        data: { id: "WkKLesQVVM", type: "payment_methods" },
                    },
                },
                id: this.cartToken,
            },
        };

        let response = await fetch(`https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/orders/${this.cartToken}?include=available_payment_methods,payment_source,payment_method,line_items.line_item_options.sku_option,line_items.item,shipping_address,billing_address,shipments.available_shipping_methods,shipments.shipment_line_items.line_item,shipments.shipping_method,shipments.stock_transfers.line_item,shipments.stock_location`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(paypalPayload),
            "method": "PATCH",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        if (status === 200){
            this.port.postMessage({msg: "Paypal has been selected!", status: "loading"});
            this.selectPaypal()
        } else {
            this.port.postMessage({msg: "Error while selecting paypal!", status: "failed"});
        }
    }

    async selectPaypal(){
        let paypalPayload = {
            data: {
                type: "paypal_payments",
                attributes: {
                    return_url:
                        `https://checkout-22.airness.eu/${this.cartToken}?paymentReturn=true`,
                    cancel_url:
                    `https://checkout-22.airness.eu/${this.cartToken}?paymentReturn=true`,
                },
                relationships: {
                    order: { data: { id: this.cartToken, type: "orders" } },
                },
            },
        };

        let response = await fetch(`https://airness-2.commercelayer.io/api/paypal_payments`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/paypal_payments`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(paypalPayload),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()
        if (status === 201){
            let paypalUrl = jsonData.data.attributes.approval_url
            let paypalID = jsonData.data.id
            this.sendPayPalCheckout(paypalUrl, paypalID)
            this.end = Date.now()
        } else {
            this.port.postMessage({msg: "Error while getting paypal token!", status: "failed"});
        }
    }

    async sendPayPalCheckout(paypalUrl, paypalId){
        let sendPayPalPayload = {
            data: {
                type: "paypal_payments",
                attributes: {
                    metadata: {
                        card: { id: paypalId, brand: "paypal", last4: "" },
                    },
                },
                relationships: {},
                id: paypalId,
            },
        };

        let response = await fetch(`https://airness-2.commercelayer.io/api/paypal_payments/${paypalId}`, {
            "headers": {
                "accept": "application/vnd.api+json",
                "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                "authorization": `Bearer ${this.access_token}`,
                "content-type": "application/vnd.api+json",
                "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": `https://airness-2.commercelayer.io/api/paypal_payments/${paypalId}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(sendPayPalPayload),
            "method": "PATCH",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        if (status === 200){
            this.port.postMessage({msg: `Successfully checked out`, status: "success", url: paypalUrl});
            let checkoutTime = (this.end - this.start) / 1000

            try {
                let date = new Date();
                let year = date.getFullYear().toString();
                let month = (date.getMonth() + 1).toString();
                let day = date.getDate().toString();

                chrome.storage.local.get(["userSuccess"], (result) => {
                    if (result["userSuccess"]){
                        let jsonData = JSON.parse(result["userSuccess"])
                        let newData = {
                            image: this.image,
                            store: "Airness",
                            name: this.name,
                            date: `${day}/${month}/${year}`
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
                                    store: "Airness",
                                    name: this.name,
                                    date: this.getCurrentDate()
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

            let publicData = {
                embeds: [{
                    author: {
                        name: 'Lollipop ext',
                        icon_url: "https://i.imgur.com/4cJK9wD.png",
                        url: "https://twitter.com/lollipop_ext"
                        },
                    title: "Detected a new candy checkout on Airness!",
                    color: 	11644927,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "LollipopEXT - 0.3"
                    },
                    fields: [
                        // you can add other fields
                        {
                            name: "Site",
                            value: "Airness",
                            inline: true,
                        },
                        {
                            name: "Item",
                            value: this.name,
                            inline: true,
                        },
                        {
                            name: "Sku",
                            value: this.sku,
                            inline: true,
                        },
                        {
                            name: "Size",
                            value: this.cartedSize,
                            inline: true,
                        },
                        {
                            name: "Quantity",
                            value: this.cartedQty,
                            inline: true,
                        },
                        {
                            name: "Mode",
                            value: this.mode,
                            inline: true,
                        },
                        {
                            name: "Checkout time",
                            value: checkoutTime.toString(),
                            inline: true
                        }
                    ], 
                    thumbnail: {
                        url: this.image
                    }
                }]
            };

            let userData = {
                embeds: [{
                    author: {
                        name: 'Lollipop ext',
                        icon_url: "https://i.imgur.com/4cJK9wD.png",
                        url: "https://twitter.com/lollipop_ext"
                        },
                    title: "Successfully checked out! Click here to pay.",
                    color: 	11644927,
                    url: paypalUrl,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "LollipopEXT - 0.3"
                    },
                    fields: [
                        {
                            name: "Site",
                            value: "Airness",
                            inline: true,
                        },
                        {
                            name: "Item",
                            value: this.name,
                            inline: true,
                        },
                        {
                            name: "Sku",
                            value: this.sku,
                            inline: true,
                        },
                        {
                            name: "Size",
                            value: this.cartedSize,
                            inline: true,
                        },
                        {
                            name: "Quantity",
                            value: this.cartedQty,
                            inline: true,
                        },
                        {
                            name: "Mode",
                            value: this.mode,
                            inline: true,
                        },
                        {
                            name: "Checkout time",
                            value: checkoutTime.toString(),
                            inline: true
                        }
                    ], 
                    thumbnail: {
                        url: this.image
                    }
                }]
            };

            let privateData = {
                embeds: [{
                    author: {
                        name: 'Lollipop ext',
                        icon_url: "https://i.imgur.com/4cJK9wD.png",
                        url: "https://twitter.com/lollipop_ext"
                        },
                    title: "Detected a new candy checkout on Airness!",
                    color: 	11644927,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "LollipopEXT - 0.3"
                    },
                    fields: [
                        // you can add other fields
                        {
                            name: "Site",
                            value: "Airness",
                            inline: true,
                        },
                        {
                            name: "Item",
                            value: this.name,
                            inline: true,
                        },
                        {
                            name: "Sku",
                            value: this.sku,
                            inline: true,
                        },
                        {
                            name: "Size",
                            value: this.cartedSize,
                            inline: true,
                        },
                        {
                            name: "Quantity",
                            value: this.cartedQty,
                            inline: true,
                        },
                        {
                            name: "Mode",
                            value: this.mode,
                            inline: true,
                        },
                        {
                            name: "User",
                            value: this.userName,
                            inline: true,
                        },
                        {
                            name: "Checkout time",
                            value: checkoutTime.toString(),
                            inline: true
                        }
                    ], 
                    thumbnail: {
                        url: this.image
                    }
                }]
            };
            this.sendWebhook(this.successWebhook, userData)

            try {
                let date = new Date();
                let year = date.getFullYear().toString();
                let month = (date.getMonth() + 1).toString();
                let day = date.getDate().toString();

                let finalDay = `${day}_${month}_${year}`
                let checkoutStats = {
                    userName: this.userName,
                    item: this.name,
                    sku: this.sku,
                    size: this.cartedSize,
                    mode: this.mode,
                    time: finalDay,
                }
            this.saveStats("airness", checkoutStats)
            this.updateSuccessCount("success")
            } catch (error) {
                console.log("An error occured while saving stats")
            }
        } else {
            this.port.postMessage({msg: "Error while checking out!", status: "failed"});
            this.updateSuccessCount("failed")
        }
    }

    async updateSuccessCount(type){
        if (type === "failed") this.notifyFailure("Airness").catch(console.error);
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
                    "totalSuccess": 0,
                    "success": 0,
                    "failed": 0
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

    sleep(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


class Snipes extends Background {
    location = "Snipes Bg"
    productImg = "https://www.megaloweb.it/fileadmin/user_upload/GLOBAL/brand_stores/logos/snipes.png"
    productName = "Null"
    productSize = "Null"
    productColor = "Null"
    productPrice = "Null"
    productSku = "Null"
    region = "Null"
    snipesMode = "super safe"
    removeListenerFunctionsCheckout = []
    removeListenerFunctionsShipping = []
    successWebhook = ""
    failedWebhook = ""
    userName = ""

    constructor (port){
        super(port)
        port.onDisconnect.addListener(() => {
            this.removeListenerFunctionsCheckout.forEach(func => func());
            this.removeListenerFunctionsShipping.forEach(func => func());
        });
    }

    async portListener(){
        this.port.onMessage.addListener((msgData) => {
            if (msgData.action){
                switch (msgData.action){
                    case "listen_checkout":
                        this.productName = msgData.data.pdpName
                        this.productImg = msgData.data.pdpImg
                        this.productColor = msgData.data.pdpColor
                        this.productSize = msgData.data.pdpSize
                        this.productPrice = msgData.data.pdpPrice
                        this.productSku = msgData.data.productSku
                        this.region = msgData.data.region
                        this.snipesMode = msgData.data.mode
                        this.initSnipes()
                        break;
                    default:
                        console.log("Snipes action not found!")
                        break;
                }
            } else {
                console.log("Error, action not found!")
            }
        })
    }

    async initSnipes(){
        chrome.storage.local.get("userSuccessWebhook", (data) => {
            if (data["userSuccessWebhook"] == undefined){
                console.log("User success webhook not found!")
            }
            else {
                this.successWebhook = data["userSuccessWebhook"]
            }
        })
    
        chrome.storage.local.get("userFailedWebhook", (data) => {
            if (data["userFailedWebhook"] == undefined){
                console.log("User failed webhook not found!")
            }
            else {
                this.failedWebhook = data["userFailedWebhook"]
            }
        })

        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                this.sniffCheckout()
                this.sniffShipping()
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async sniffCheckout(){
        let callback = async (details) => {
            if (details.url.includes("https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token")&& details.initiator.includes("https://www.snipes.")){
                console.log("Successfully checked out!")
                try {
                    let date = new Date();
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString();
                    let day = date.getDate().toString();
                    let finalDay = `${day}/${month}/${year}`

                    let checkoutStats = {
                        userName: this.userName,
                        item: `${this.productName} ${this.productColor}`,
                        size: this.productSize,
                        price: this.productPrice,
                        time: finalDay,
                    }
                this.saveStats("snipes", checkoutStats)
                } catch (error) {
                    console.log("An error occured while saving stats")
                }
                this.port.postMessage({msg: "Successfully checked out!", status: "success", url: details.url});
                chrome.webRequest.onBeforeRequest.removeListener(callback);
                this.removeListenerFunctionsCheckout.forEach(func => func());
            }
        }

        // register the listener
        chrome.webRequest.onBeforeRequest.addListener(callback, { urls: ['<all_urls>'] }, ['requestBody'])

        // Save anonymous function that removes the listener
        this.removeListenerFunctionsCheckout.push(() => chrome.webRequest.onBeforeRequest.removeListener(callback));
    }

    async sniffShipping(){
        let callback = async (details) => {
            if (details.url.includes("shipping-methods") && details.initiator.includes("https://www.snipes.")){
                console.log("Error while checking out. Submitting shipping")
                this.port.postMessage({msg: "Submit shipping", status: "error"});
                chrome.webRequest.onBeforeRequest.removeListener(callback);
                this.removeListenerFunctionsShipping.forEach(func => func());
            }
        }

        // register the listener
        chrome.webRequest.onBeforeRequest.addListener(callback, { urls: ['<all_urls>'] }, ['requestBody'])

        // Save anonymous function that removes the listener
        this.removeListenerFunctionsShipping.push(() => chrome.webRequest.onBeforeRequest.removeListener(callback));
    }
}

class LVR extends Background {
    location = "LVR - BG"

    removeListenerFunctions = []

    constructor (port){
        super(port)
        port.onDisconnect.addListener(() => {
            this.removeListenerFunctions.forEach(func => func());
        });
    }

    /**
     * Execute a script in the 'MAIN' contect to get a property on the window object
     * @param propertyPath The path of the window property including 'window' (eg. 'window.product.variations')
     * @param onCompleteEventName The event to dispatch
     */

    async portListener(){
        this.port.onMessage.addListener((msgData) => {
            if (msgData.action){
                switch (msgData.action){
                    case "getData":
                        this.getWindowProperty(msgData.dataName, msgData.event)
                        break;
                    case "saveStats":
                        this.saveLvrInfo(msgData.productInfo)
                        console.log("triggered")
                        break;
                    default:
                        console.log("LVR action not found!")
                        break;
                }
            } else {
                console.log("Error, action not found!")
            }
        })
    }

    getWindowProperty(propertyPath, onCompleteEventName) {
        console.log(propertyPath, onCompleteEventName)

        // This is the function that I Inject into the window
        function inject(propertyPath, onCompleteEventName) {
            try {
                // Get the value
                let value = propertyPath.split('.').reduce(function (obj, prop) {
                    return obj && obj[prop];
                }, window);
        
                // Create the custom event (with the random generated string)
                let event = new CustomEvent(onCompleteEventName, {
                    detail: value
                });

                console.log(event)
                document.dispatchEvent(event);
            } catch (error) {
                console.log(error)
            }
        }
    
        // Make sure to inject the code into the right tab (from where we connected to the Service Worker)
        const tabId = this.port.sender.tab.id;
        if (!tabId){
            console.log("No sender ID has been found!")
        }
    
        // Use the Chrome API to inject the function above into the page
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            world: 'MAIN', // Important!
            func: inject,
            args: [propertyPath, onCompleteEventName] // These arguments will be passed into the function that we're injecting
        });
    }

    async saveLvrInfo(productInfo){
        //console.log(productInfo)
        try {
            let date = new Date();
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            let day = date.getDate().toString();
            let finalDay = `${day}/${month}/${year}`

            let checkoutStats = {
                userName: productInfo.userName,
                item: productInfo.item,
                size: productInfo.size,
                sku: productInfo.sku,
                cartPrice: productInfo.cartPrice,
                time: finalDay,
            }
        this.saveStats("lvr", checkoutStats)
        } catch (error) {
            console.log("An error occured while saving stats")
            console.log(error)
        }
    }
}


class Solebox extends Background {
    location = "Solebox Bg"
    productImg = "https://www.solebox.com/on/demandware.static/Sites-solebox-Site/-/default/dwe95d97ec/images/solebox_logo.svg"
    productName = "Null"
    productSize = "Null"
    productColor = "Null"
    productPrice = "Null"
    productSku = "Null"
    region = "Null"
    snipesMode = "super safe"
    removeListenerFunctionsCheckout = []
    removeListenerFunctionsShipping = []
    successWebhook = ""
    failedWebhook = ""
    userName = ""

    constructor (port){
        super(port)
        port.onDisconnect.addListener(() => {
            this.removeListenerFunctionsCheckout.forEach(func => func());
            this.removeListenerFunctionsShipping.forEach(func => func());
        });
    }

    async portListener(){
        this.port.onMessage.addListener((msgData) => {
            if (msgData.action){
                switch (msgData.action){
                    case "listen_checkout":
                        this.productName = msgData.data.pdpName
                        this.productImg = msgData.data.pdpImg
                        this.productColor = msgData.data.pdpColor
                        this.productSize = msgData.data.pdpSize
                        this.productPrice = msgData.data.pdpPrice
                        this.productSku = msgData.data.productSku
                        this.region = msgData.data.region
                        this.snipesMode = msgData.data.mode
                        this.initSbx()
                        break;
                    default:
                        console.log("Solebox action not found!")
                        break;
                }
            } else {
                console.log("Error, action not found!")
            }
        })
    }

    async initSbx(){
        chrome.storage.local.get("userSuccessWebhook", (data) => {
            if (data["userSuccessWebhook"] == undefined){
                console.log("User success webhook not found!")
            }
            else {
                this.successWebhook = data["userSuccessWebhook"]
            }
        })
    
        chrome.storage.local.get("userFailedWebhook", (data) => {
            if (data["userFailedWebhook"] == undefined){
                console.log("User failed webhook not found!")
            }
            else {
                this.failedWebhook = data["userFailedWebhook"]
            }
        })

        chrome.storage.sync.get(["userDiscordName"], (result) => {
            if (result["userDiscordName"]){
                this.userName = result["userDiscordName"]
                this.sniffCheckout()
                //this.sniffShipping()
            } else {
                console.log("User discord not found!")      
            }
        })
    }

    async sniffCheckout(){
        let callback = async (details) => {
            if (details.url.includes("https://www.paypal.com/")&& details.initiator.includes("https://www.solebox.")){
                console.log("Successfully checked out!")
                try {
                    let date = new Date();
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString();
                    let day = date.getDate().toString();
                    let finalDay = `${day}/${month}/${year}`

                    let checkoutStats = {
                        userName: this.userName,
                        item: `${this.productName} ${this.productColor}`,
                        size: this.productSize,
                        price: this.productPrice,
                        time: finalDay,
                    }
                this.saveStats("solebox", checkoutStats)
                } catch (error) {
                    console.log("An error occured while saving stats")
                }
                this.port.postMessage({msg: "Successfully checked out!", status: "success", url: details.url});
                chrome.webRequest.onBeforeRequest.removeListener(callback);
                this.removeListenerFunctionsCheckout.forEach(func => func());
            }
        }

        // register the listener
        chrome.webRequest.onBeforeRequest.addListener(callback, { urls: ['<all_urls>'] }, ['requestBody'])

        // Save anonymous function that removes the listener
        this.removeListenerFunctionsCheckout.push(() => chrome.webRequest.onBeforeRequest.removeListener(callback));
    }

    async sniffShipping(){
        let callback = async (details) => {
            if (details.url.includes("shipping") && details.initiator.includes("https://www.solebox.")){
                console.log("Error while checking out. Submitting shipping")
                this.port.postMessage({msg: "Submit shipping", status: "error"});
                chrome.webRequest.onBeforeRequest.removeListener(callback);
                this.removeListenerFunctionsShipping.forEach(func => func());
            } else {
                console.log(details)
            }
        }

        // register the listener
        chrome.webRequest.onBeforeRequest.addListener(callback, { urls: ['<all_urls>'] }, ['requestBody'])

        // Save anonymous function that removes the listener
        this.removeListenerFunctionsShipping.push(() => chrome.webRequest.onBeforeRequest.removeListener(callback));
    }
}

class Dashboard extends Background {
    location = "Solebox Bg"
    removeListenerFunctions = []

    constructor (port){
        super(port)
        port.onDisconnect.addListener(() => {
            this.removeListenerFunctions.forEach(func => func());
        });
    }

    async portListener(){
        this.port.onMessage.addListener((msgData) => {
            if (msgData.action){
                switch (msgData.action){
                    case "check_version":
                        this.checkVersion()
                        break;
                    default:
                        console.log("Dashboard action not found!")
                        break;
                }
            } else {
                console.log("Error, action not found!")
            }
        })
    }

    async checkVersion(){
        this.port.postMessage({msg: "success", data: {"current-version": chrome.runtime.getManifest().version}});
    }
}

chrome.runtime.onConnect.addListener((port) => {
    new Background(port);
    switch (port.name){
        case "airness":
            new Airness(port).portListener()
            break;
        case "snipes":
            new Snipes(port).portListener()
            break;
        case "solebox":
            new Solebox(port).portListener()
            break;
        case "lvr":
            new LVR(port).portListener()
            break;
        case "dashboard":
            new Dashboard(port).portListener()
            break;
        default:
            console.log(`Port name not found: ${port.name}`)
            break;
    }
});


