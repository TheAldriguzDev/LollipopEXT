class History {
    async createTable(){
        chrome.storage.local.get(["userSuccess"], (result) => {
            if (result["userSuccess"]){
                let jsonData = JSON.parse(result["userSuccess"])
                let reverted = jsonData.data.reverse()
                try {
                    reverted.forEach(elem => {
                        document.querySelector("div[class*='actual-checkouts-div']").innerHTML += 
                        `<div class="old-checkout">
                            <div class="checkout-pic-div">
                                <img class="checkout-pic" src="${elem.image}" alt="img">
                            </div>
                            <div class="vertical-separator"></div>
                            <div class="checkout-name-div">
                                <div class="temp-name">
                                    <span class="checkout-name">${elem.name}</span>
                                </div>
                            </div>
                            <div class="vertical-separator"></div>
                            <div class="checkout-store-div">
                                <span class="checkout-store">${elem.store}</span>
                            </div>
                            <div class="vertical-separator"></div>
                            <div class="checkout-date-div">
                                <span class="checkout-date">${elem.date}</span>
                            </div>
                        </div>`
                    })
                } catch (error) {
                    console.log("Error while adding success")
                }
            } else {
                console.log("Success not found!")
            }
        }) 
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

    new History().createTable()

}
