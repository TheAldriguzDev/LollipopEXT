class Utils {

    static getCurrentTime() {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth().toString();
        const day = date.getDay().toString();
        const hours = date.getHours().toString();
        const minutes = date.getMinutes().toString();
        const seconds = date.getSeconds().toString();
        return `[${day}-${month}-${year}] [${hours}:${minutes}:${seconds}]`;
    }

    static getCurrentDate() {
        let date = new Date();
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        return `${day}/${month}/${year}`;
    }

    static log(message, store) {
        console.log(`${this.getCurrentTime()} [${store}] --> ${message}`);
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
    }

    static sleep(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static makeid(length) {
        var result = '';
        var characters = 'qwertyuioplkjhgfdsazxcvbnmABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static genEmail(length) {
        var result = '';
        var characters = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static genPhone() {
        var result = '3';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 9; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
