class Profile{
    location = "Profile";

    constructor(profileInfo, profileName){
        this.profileInfo = profileInfo;
        this.profileName = profileName;
    }

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

    async saveAccount(){
        if (this.profileInfo && this.profileName){
            let newProfile = {
                name: this.profileName,
                info: this.profileInfo
            }
            chrome.storage.sync.get(["profiles"], (result) => {
                if (result["profiles"]){
                    let profilesJSON = JSON.parse(result["profiles"])
                    profilesJSON.profiles.push(newProfile)
                    chrome.storage.sync.set({
                        ["profiles"] : JSON.stringify(profilesJSON)
                    }, () => {
                        console.log("Profiles has been updated!")
                        this.showSuccess()
                    })
                } else {
                    let jsonProfiles = {
                        profiles: []
                    }
                    chrome.storage.sync.set({
                        ["profiles"] : JSON.stringify(jsonProfiles)
                    }, () => {
                        console.log("Profiles has been initialised!")
                        this.saveAccount()
                    })
                }
            })
        } else {
            alert("Profile info or profile name is missing")
            this.showError()
        }
    }

    async displayInfo(profileName){
        let firstName = document.getElementById("firstName")
        let lastName = document.getElementById("lastName")
        let street = document.getElementById("street")
        let houseNumber = document.getElementById("houseNumber")
        let city = document.getElementById("city")
        let postalCode = document.getElementById("postalCode")
        let state = document.getElementById("state")
        let country = document.getElementById("country")
        let email = document.getElementById("email")
        let phone = document.getElementById("phone")

        chrome.storage.sync.get(["profiles"], (result) => {
            if (result["profiles"]){
                let profileJSON = JSON.parse(result["profiles"])
                let i = 0;
                while (profileJSON.profiles[i].name != profileName){
                    i++;
                }
                firstName.value = profileJSON.profiles[i].info.firstName
                lastName.value = profileJSON.profiles[i].info.lastName
                street.value = profileJSON.profiles[i].info.street
                houseNumber.value = profileJSON.profiles[i].info.houseNumber
                city.value = profileJSON.profiles[i].info.city
                postalCode.value = profileJSON.profiles[i].info.postalCode
                state.value = profileJSON.profiles[i].info.state
                country.value =profileJSON.profiles[i].info.country
                email.value = profileJSON.profiles[i].info.email
                phone.value =profileJSON.profiles[i].info.phone

                console.log("Information displayed")
            } else {
                console.log("No profiles has been found!")
            }
        })
    }

    async updateProfile(){
        if (this.profileInfo && this.profileName){
            chrome.storage.sync.get(["profiles"], (result) => {
                if (result["profiles"]){
                    let profileJSON = JSON.parse(result["profiles"])
                    let i = 0;
                    while (profileJSON.profiles[i].name != this.profileName){
                        i++;
                    }
                    profileJSON.profiles[i].info = this.profileInfo;
                    chrome.storage.sync.set({
                        ["profiles"] : JSON.stringify(profileJSON)
                    }, () => {
                        console.log("Profiles has been updated!")
                        this.showSuccess()
                    })
                } else {
                    console.log("No profile has been found!")
                    this.showError()
                }
            })
        } else {
            alert("Profile info or name are missing")
            this.showError()
        }
    }

    async deleteProfile(profileName){
        if (profileName){
            chrome.storage.sync.get(["profiles"], (result) => {
                if (result["profiles"]){
                    let profileJSON = JSON.parse(result["profiles"])
                    let i = 0;
                    while (profileJSON.profiles[i].name != profileName){
                        i++;
                    }
                    profileJSON.profiles.splice(i, 1);
                    chrome.storage.sync.set({
                        ["profiles"] : JSON.stringify(profileJSON)
                    }, () => {
                        console.log("Profiles has been deleted!")
                        this.showSuccess()
                    })
                } else {
                    console.log("No profiles has been found!")
                    this.showError()
                }
            })
        } else {
            alert("Profile name is missing")
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


    let createProfile = document.getElementById("createProfile")
    let updateProfile = document.getElementById("updateProfile")
    let deleteProfile = document.getElementById("deleteProfile")
    let selection = document.getElementById("selectProfile")

    chrome.storage.sync.get(["profiles"], (result) => {
        if (result["profiles"]){
            let profilesJSON = JSON.parse(result["profiles"])
            for (let i = 0; i < profilesJSON.profiles.length; i++){
                let select = document.getElementById("selectProfile");
                let option = document.createElement("option");
                option.value = profilesJSON.profiles[i].name;
                option.text = profilesJSON.profiles[i].name;
                select.add(option);
            }
        }
    })

    createProfile.addEventListener("click", () => {
        let profileName = document.getElementById("profileName").value
        let profileData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            street: document.getElementById("street").value,
            houseNumber: document.getElementById("houseNumber").value,
            city: document.getElementById("city").value,
            postalCode: document.getElementById("postalCode").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
        }
        new Profile(profileData, profileName).saveAccount()
    })

    updateProfile.addEventListener("click", () => {
        let profileName = selection.value
        let profileData = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            street: document.getElementById("street").value,
            houseNumber: document.getElementById("houseNumber").value,
            city: document.getElementById("city").value,
            postalCode: document.getElementById("postalCode").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
        }
        new Profile(profileData, profileName).updateProfile()
    })

    selection.addEventListener("change", () => {
        console.log("Select has been changed")
        new Profile().displayInfo(selection.value)
    })

    deleteProfile.addEventListener("click", () => {
        let profileName = selection.value
        new Profile().deleteProfile(profileName)
    })
}
