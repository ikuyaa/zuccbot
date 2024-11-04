import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message } from 'discord.js';
import {KazagumoPlayer, KazagumoTrack} from "kazagumo";
import {EmbedGenerator, MessageHelper, Time} from "../../helpers/Helpers";


export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song playing.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    let player: KazagumoPlayer | undefined = client.musicManager.players.get(interaction.guildId!);

    if(!player) {
        const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, 10);
        return;
    }

    if(!player.queue.current) {
        const embed = EmbedGenerator.Error('No song is currently playing.');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, 10);
        return;
    }
    player.skip();
    if(player.queue.length === 0) {
        player.destroy();
        const embed = EmbedGenerator.NoMoreTracks();
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    } else {
        const embed = EmbedGenerator.PlayEmbed(player.queue[0]);
        await interaction.reply({ embeds: [embed] });
        return;
    }
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}