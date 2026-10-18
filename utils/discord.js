export class Discord{
    // Declaration of webhooks that we can use
    webhook = ""; // empty because is the user one

    constructor(webhookPayload){
        this.webhookPayload = webhookPayload;
    }

    // Handle of the webhooks type
    async switchWebhook(webhook){
        if (webhook && this.webhookPayload) {
            await this.sendWebhook(webhook);
        }
    }

    // Method to send webhooks
    async sendWebhook(webhook){
        if (webhook && this.webhookPayload){
            console.log("Sending webhook...")
            let params = {
                embeds: [this.webhookPayload]
            };

            let response = await fetch(webhook, {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "en",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
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

            // handler of response status code
            let status = response.status
            switch (status) {
                case status === 204:
                    console.log("Log has been sent on Discord!")
                    break;
                case status === 200:
                    console.log("Log has been sent on Discord!")
                    break;
                case status === 429:
                    // ratelimits handler
                    console.log("Error while sending webhook on Discord! [Ratelimited]")
                    console.log("Handling the ratelimit...")
                    let timeOut = parseInt(response.headers['retry-after'])
                    setTimeout(() => {
                        this.sendWehook(webhook)
                    }, timeOut);
                    break;
                default:
                    console.log("Unknow error while sending the webhook!");
                    break
            }
        }
    }
}