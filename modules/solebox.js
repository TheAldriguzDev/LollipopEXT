class Solebox {

    location = "Solebox"
    dataSizePid = []                
    size = []
    cartedPid = ""

    constructor(pid, region, sizeMin, sizeMax){
        this.pid = pid;
        this.region = region;
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

    async getPids(){
        if (this.pid.length === 8){
            this.addMessage("Starting normal mode!", "loading")
            document.querySelectorAll('span[class*="b-swatch-value--orderable"]').forEach(elem => {
                if (this.sizeMin <= elem.getAttribute('data-attr-value') && elem.getAttribute('data-attr-value') <= this.sizeMax){
                    this.size.push(elem.getAttribute('data-attr-value'))
                }
            })
            for (let index = 0; index < this.size.length; index++) {
                var pid = document.querySelector('a[class*="js-pdp-attribute-btn b-pdp-swatch-link js-pdp-attribute-btn--size"][data-value*="'+this.size[index]+'"]').getAttribute('data-variant-id')
                this.dataSizePid.push(pid)
            }
            if (this.dataSizePid.length != 0){
                this.addMessage("Stock has been found!", "success")
                var random = Utils.getRandomInt(0, this.dataSizePid.length-1)
                this.cartedPid = this.dataSizePid[random]
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
            let d = this.region;
            let atcData = 'pid=' + this.cartedPid + '&options:[{"optionId":"size","selectedValueId":"RANDOM"}]'+'&quantity=1';

            let response = await fetch(`https://www.solebox.com/`+d+`/add-product?format=ajax`, {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "it-IT,it;q=0.9,en-IT;q=0.8,en;q=0.7,si-LK;q=0.6,si;q=0.5,en-US;q=0.4",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": document.URL,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": atcData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            let status = await response.status
            let responseData = await response.json()

            if (status === 200 && responseData){
                if (responseData.action === "Cart-AddProduct"){
                    this.addMessage("Added to cart!", "success")
                    window.open("https://www.solebox.com/"+d+"/checkout?stage=placeOrder#placeOrder")
                } else {
                    this.addMessage("Error in ATC. Retrying...")
                    await Utils.sleep(2500)
                    this.addToCart()
                }
            } else {
                this.addMessage("Error in ATC. Retrying...")

                await Utils.sleep(2500)
                this.addToCart()
            }
        }
    }
}


window.onload = () => {
    chrome.storage.sync.get(["soleboxStatus"], (result) => {
        if (result["soleboxStatus"] && result["soleboxStatus"] === "ON"){
            startModule()
        } else {
            console.log("Module off")
        }
    })
}

async function startModule(){
    let soleboxMin
    let soleboxMax

    chrome.storage.sync.get(["soleboxMin"], (resultMin) => {
        if (resultMin["soleboxMin"]){
            soleboxMin = parseFloat(resultMin["soleboxMin"])
            chrome.storage.sync.get(["soleboxMax"], (resultMax) => {
                if (resultMax["soleboxMax"]){
                    soleboxMax = parseFloat(resultMax["soleboxMax"])
                    let task = new Solebox(document.URL.split("-")[document.URL.split("-").length-1].split(".")[0], document.URL.split('//')[1].split('/')[1], soleboxMin, soleboxMax)
                    task.injectConsole()
                    task.getPids()
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
