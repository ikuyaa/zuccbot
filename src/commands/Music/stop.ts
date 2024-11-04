import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message } from 'discord.js';
import {KazagumoPlayer} from "kazagumo";
import { EmbedGenerator, Time, MessageHelper, MusicHelper } from "../../helpers/Helpers";


export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops, and destroys, the current player. This will delete your queue.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    const player: KazagumoPlayer | undefined = client.musicManager.getPlayer(interaction.guildId as string);

    if(!player) {
        const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    if(!player.queue.current) {
        const embed = EmbedGenerator.Error('No song is currently playing.');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    await MusicHelper.stopPlayer(player, interaction);
    return;
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}