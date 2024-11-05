import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, } from 'discord.js';
import {EmbedGenerator, LogHelper} from "../../helpers/Helpers";
import {KazagumoQueue} from "kazagumo";


export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue of the bot.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    if(!interaction.isRepliable())
        return;

    const player = client.musicManager.players.get(interaction.guildId as string);

    if(!player) {
        const embed = EmbedGenerator.Error("No player found. Are you playing music?");
        await interaction.reply({embeds: [embed], ephemeral: true});
        return;
    }

    const queue: KazagumoQueue = player.queue;
    try {
        const embed = EmbedGenerator.QueueEmbed(queue);
        await interaction.reply({embeds: [embed]});
        return;
    } catch (err: any) {
        try {
            LogHelper.error(err);
            const embed = EmbedGenerator.Error("Error getting queue. Please try again later.");
            await interaction.reply({embeds: [embed], ephemeral: true});
            return;
        } catch (err: any) {
            LogHelper.error(err);
            return;
        }
    }
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}