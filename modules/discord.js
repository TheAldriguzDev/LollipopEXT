class Discord {
    location = "Discord"

    constructor(webhook, payload){
        this.webhook = webhook;
        this.payload = payload
    }

    async switchWebhook(){
        if (this.webhook && this.payload) {
            await this.sendWebhook(this.webhook);
        }
    }

    async sendWebhook(webhook){
        if (webhook){
            var params = {
                embeds: [this.payload]
            };
            let response = await fetch(`${webhook}`, {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "en",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                    "referrer": "https://discohook.org/",
                    "referrerPolicy": "strict-origin",
                    "body": JSON.stringify(params),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "omit"
            });

            let status = await response.status

            switch (status){
                case 200:
                    console.log("Webhook has been sent on discord!")
                    break;
                case 201:
                    console.log("Webhook has been sent on discord!")
                    break;
                case 202:
                    console.log("Webhook has been sent on discord!")
                    break;
                case 204:
                    console.log("Webhook has been sent on discord!")
                    break;
                case 429:
                    console.log("Error while sending the webhook! [Ratelimited]")
                    let timeOut = 1500
                    setTimeout(() => {
                        this.sendWehook(webhook)
                    },timeOut)
            }
        } else {
            console.log("Error, webhook not found!")
        }
    }
}