import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder } from 'discord.js';
import {KazagumoPlayer} from "kazagumo";
import {EmbedGenerator, MessageHelper, MusicHelper, Time, LogHelper} from "../../helpers/Helpers";

export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the volume for the player.')
    .addIntegerOption( option =>
        option
            .setName('volume')
            .setDescription('The volume you want to set.')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
    )

export async function run({interaction, client, handler}: SlashCommandProps) {
    const player: KazagumoPlayer | undefined = client.musicManager.getPlayer(interaction.guildId as string);
    const volume: number = interaction.options.getInteger('volume') as number;
    if(!player) {
        try {
            const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        } catch(err: any) {
            LogHelper.error(err);
            return;
        }
    }

    await MusicHelper.setVolume(player, interaction, volume).catch((err: any) => {
        LogHelper.error(err);
        return
    });
    
    return;
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}