import { KazagumoPlayer } from "kazagumo";
import { LogHelper } from "../../helpers/Helpers";
import { Client } from "discord.js";

export default class MusicEvents {
    public static async onPlayerCreate(player: KazagumoPlayer) {
        LogHelper.log(`New player created in guild ${player.guildId}`);
    }

    public static async onMusicReady(name: string) {
        LogHelper.log(`✔️  Node ${name} is ready!`);
    }

    public static async onMusicError(name: string, error: any) {
        LogHelper.error(`❌  Node ${name} has encountered an error: ${error}`);
    }

    public static async onMusicClose(name: string, code: any, reason: string) {
        LogHelper.error(`❌  Node ${name} has closed with code ${code} and reason ${reason || 'No reason provided'}`);
    }

}