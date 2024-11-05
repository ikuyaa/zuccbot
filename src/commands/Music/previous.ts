import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder } from 'discord.js';
import {KazagumoPlayer} from "kazagumo";
import {EmbedGenerator, MessageHelper, MusicHelper, Time} from "../../helpers/Helpers";


export const data = new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays the previous track in the queue.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    const player: KazagumoPlayer | undefined = client.musicManager.getPlayer(interaction.guildId as string);

    if(!player) {
        const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    await MusicHelper.playPrevious(player, interaction);
    return;

}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}