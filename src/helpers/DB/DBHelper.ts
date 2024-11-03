import mongoose from 'mongoose';
import 'dotenv/config';
import LogHelper from '../Logging/LogHelper';

const options: mongoose.ConnectOptions = {
    dbName: process.env.MONGO_DB_NAME,
}

export default class DBHelper {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI as string, options as mongoose.ConnectOptions);

            LogHelper.log(`✔️  Connected to Database.`);
        } catch (err: any) {
            LogHelper.log(`❌ Error connecting to Database. Error: ${err}`);
        }
    }
}