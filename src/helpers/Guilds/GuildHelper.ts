import Guild, { IGuild } from '../../models/Guilds/Guild';
import {LogHelper} from '../Helpers';

export default class GuildHelper {

    public static async IsGuildRegistered(guildId: string): Promise<boolean> {
        //Checking if the guild is in the database, and returning true or false based on the results.
        const guild: IGuild | null = await Guild.findOne({  guildId: guildId });
        //May need to error check this...
        if(guild) {
            return true;
        } else {
            return false;
        }
    }

    public static async GetGuild(guildId: string): Promise<IGuild | null> {
        //Search the database for the guild, then return it, or return null.
        try {
            const guild: IGuild | null = await Guild.findOne({ guildId: guildId });
            
            if(guild) {
                return guild;
            } else { //Doing this here and the catch block just incase..
                LogHelper.log(`❌ Error getting guild ${guildId} from database. Error: Guild not found.`);
                return null;
            }
        } catch (err: any) {
            LogHelper.log(`❌ Error getting guild ${guildId} from database. Error: ${err}`);
            return null;
        }
    }

    public static async RegisterGuild(guild: IGuild): Promise<IGuild> {
        //Create a new document in the database for the guild and return it.

        try {
            const newGuild = new Guild(guild);
            await newGuild.save();

            return newGuild;
        } catch (err: any) {
            LogHelper.log(`❌ Error registering guild to database. Error: ${err}`);
            throw new Error(`Error registering guild to database.`);
        }
    }
}