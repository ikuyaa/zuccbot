import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder } from 'discord.js';
import {KazagumoPlayer} from "kazagumo";
import { MusicHelper } from "../../helpers/Helpers";


export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song playing.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    let player: KazagumoPlayer | undefined = client.musicManager.players.get(interaction.guildId!);
    
    await MusicHelper.skipSong(player, interaction);
    return;
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}