import Guild, { IGuild } from '../../models/Guilds/Guild';
import {LogHelper} from '../Helpers';
import Datastore from 'nedb-promises';
import 'dotenv/config';
import client from '../../index';
import {Collection} from 'mongoose';

const localDB: any = process.env.DB_TYPE ==='LOCAL' ? Datastore.create({ filename: './src/localDatabases/Guilds.db', autoload: true, }) : undefined;

export default class GuildHelper {

    public static async IsGuildRegistered(guildId: string): Promise<boolean> {

        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
            //Checking if the guild is in the database, and returning true or false based on the results.
            const guild: IGuild | null = await Guild.findOne({  guildId: guildId });
            //May need to error check this...
            if(guild) 
                return true;
            else
                return false;

        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            const guild: IGuild | undefined = await localDB?.findOne({ guildId: guildId });

            if(guild) 
                return true;
            else 
                return false;
        }

        return false;

    }

    public static async GetGuild(guildId: string): Promise<IGuild | null> {
        //Search the database for the guild, then return it, or return null.
        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
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
        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            try {
                const guild: IGuild | null = await localDB?.findOne({ guildId: guildId });
                return guild;
            } catch (err: any) {
                LogHelper.log(`❌ Error getting guild ${guildId} from database. Error: ${err}`);
                return null;
            }
        }

        return null;
    }

    public static async RegisterGuild(guild: IGuild): Promise<IGuild | null> {
        //Create a new document in the database for the guild and return it.

        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
            try {
                const newGuild = new Guild(guild);
                await newGuild.save();
    
                return newGuild;
            } catch (err: any) {
                LogHelper.log(`❌ Error registering guild to database. Error: ${err}`);
                throw new Error(`Error registering guild to database.`);
            }
        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            try {
                const newGuild = await localDB?.insert({
                    guildId: guild.guildId,
                    musicChannelId: guild.musicChannelId,
                    djRoleId: guild.djRoleId,
                    registeredBy: guild.registeredBy,
                    createdAt: new Date(),
                }) as IGuild;
                return newGuild;
            } catch (err: any) {
                LogHelper.log(`❌ Error registering guild to database. Error: ${err}`);
                throw new Error(`Error registering guild to database.`);
            }
        }

        return null;
    }

    public static async UpdateGuild(guild: IGuild): Promise<IGuild | null> {
        //Update the guild in the database and return it.

        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
            try {
                const updatedGuild = await Guild.findOneAndUpdate({ guildId: guild.guildId }, guild, { new: true });
                return updatedGuild;
            } catch (err: any) {
                LogHelper.log(`❌ Error updating guild ${guild.guildId} in database. Error: ${err}`);
                throw new Error(`Error updating guild ${guild.guildId} in database.`);
            }
        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            try {
                const updatedGuild = await localDB?.updateOne({ guildId: guild.guildId }, { $set: guild }, { returnUpdatedDocs: true, multi: false, upsert: true });
                return updatedGuild;
            } catch (err: any) {
                LogHelper.log(`❌ Error updating guild ${guild.guildId} in database. Error: ${err}`);
                throw new Error(`Error updating guild ${guild.guildId} in database.`);
            }
        }

        return null;
    }

    public static async GetMainMusicMessageId(guildId: string): Promise<string | null> {
        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
            try {
                const guild: IGuild | null = await Guild.findOne({ guildId: guildId });
                return guild?.musicMessageId? guild.musicMessageId as string : null ;
            } catch (err: any) {
                LogHelper.log(`❌ Error getting main music message id for guild ${guildId}. Error: ${err}`);
                return null;
            }
        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            try {
                const guild: IGuild | null = await localDB?.findOne({ guildId: guildId });
                return guild?.musicMessageId? guild.musicMessageId as string : null ;
            } catch (err: any) {  
                LogHelper.log(`❌ Error getting main music message id for guild ${guildId}. Error: ${err}`);
                return null;
            }
        }
        return null;
    }

    public static async GetMainMusicChannelId(guildId: string): Promise<string | null> {
        if(process.env.DB_TYPE?.toUpperCase() === 'MONGO') {
            try {
                const guild: IGuild | null = await Guild.findOne({ guildId: guildId });
                const musicChannelId = guild?.musicChannelId? guild.musicChannelId as string : null;

                return musicChannelId;
            } catch (err: any) {
                LogHelper.log(`❌ Error getting main music channel id for guild ${guildId}. Error: ${err}`);
                return null;
            }
        } else if (process.env.DB_TYPE?.toUpperCase() === 'LOCAL') {
            try {
                const guild: IGuild | null = await localDB?.findOne({ guildId: guildId });
                const musicChannelId: string | null = guild?.musicChannelId? guild.musicChannelId as string : null;
                return musicChannelId;
            } catch (err: any) {
                LogHelper.log(`❌ Error getting main music channel id for guild ${guildId}. Error: ${err}`);
                return null;
            }
        }
        return null;
    }
}