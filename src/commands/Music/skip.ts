import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message } from 'discord.js';
import {KazagumoPlayer, KazagumoTrack} from "kazagumo";
import {EmbedGenerator, MessageHelper, MusicHelper, Time} from "../../helpers/Helpers";


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