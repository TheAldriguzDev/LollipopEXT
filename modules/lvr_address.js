class Lvr {
    location = "LVR - Address"
    profileData

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

    async fetchProfile(profileName){
        try {
            chrome.storage.sync.get(["profiles"], (result) => {
                if (result["profiles"]){
                    let profileJSON = JSON.parse(result["profiles"])
                    let i = 0;
                    while (profileJSON.profiles[i].name != profileName){
                        i++;
                    }
                    this.profileData = {
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

                    this.saveAddress()
                } else {
                    console.log("No profiles has been found!")
                    this.addMessage("Error while getting profile!", "failed")
                }
            })
        } catch (error) {
            console.log("Error while getting the profile!")
            this.addMessage("Error while getting profile!", "failed")
        }
    }

    async saveAddress(){

        let shippingData = {
            "AddressID": null,
            "FirstName": this.profileData.firstName,
            "LastName": this.profileData.lastName,
            "Phone": this.profileData.phone,
            "Address": `${this.profileData.street} ${this.profileData.houseNumber}`,
            "ZipCode": this.profileData.postalCode,
            "City": this.profileData.city,
            "CountryID": this.profileData.country,
            "ProvID": this.profileData.state,
            "CodFisc": null,
            "CodDestinatario": null,
            "PecDestinatario": null,
            "IsShipping": true,
            "IsBilling": true,
            "IsDefaultShipping": true,
            "IsDefaultBilling": true
        }

        let response = await fetch("https://www.luisaviaroma.com/myarea/usersession/saveaddress", {
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
            "body": JSON.stringify(shippingData),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let status = await response.status
        let jsonData = await response.json()

        if (status === 200 && jsonData.Code === "Success"){
            this.addMessage("Profile has been created!", "success")

        } else {
            console.log("Error while saving the profile!")
            this.addMessage("Error in creating!", "failed")
        }
    }
}


window.onload = () => {
    chrome.storage.sync.get(["lvrProfile"], (resultProfile) => {
        if (resultProfile["lvrProfile"]){
            lvrProfile = resultProfile["lvrProfile"]
            let task = new Lvr()
            task.injectConsole()
            task.fetchProfile(lvrProfile)
        } else {
            console.log("No lvr profile has been found!")
            this.addMessage("No profile has been found!", "failed")
        }
    })
}