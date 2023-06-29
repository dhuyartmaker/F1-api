
import mongoose from 'mongoose';

import * as overwriteDevConfig from '../src/config/dev.config.json';
import * as overwriteDefaultConfig from '../src/config/config.json';

const configDefault = {
}
const env = process.env.NODE_ENV || "pro";
console.log("===env===", env);

const config = {
    ...configDefault,
    ...(env === "dev" ? overwriteDevConfig : overwriteDefaultConfig),
}

const connectString = config.db;

class Database {
    static instance : any = null;

    constructor() {
        this.connect()
    }

    connect() {
        console.log("==", connectString)
        if ("dev") {
            mongoose.set("debug", false)
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then((res : any) => {
            console.log("Connect Success!!")
        })
            .catch((error: any) => console.log("Connect error: ", error));
    }

    static getInstance() {
        if (!this.instance) {
            Database.instance = new Database()
        }
        return this.instance;
    }
}

export default Database;