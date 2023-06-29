import mongoose from 'mongoose';
import config from '../config/config';
const connectString = config.config.db;

class Database {
    static instance : any = null;

    constructor() {
        this.connect()
    }

    connect() {
        if ("dev") {
            mongoose.set("debug", true)
            mongoose.set("debug", { color: true })
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

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb;