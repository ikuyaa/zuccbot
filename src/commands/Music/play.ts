import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message, GuildMember, PermissionsBitField } from 'discord.js';
import client from '../../index';
import {EmbedGenerator, LogHelper, MessageHelper, MusicHelper, Time} from "../../helpers/Helpers";
import { KazagumoPlayer } from "kazagumo";
import 'dotenv/config';


export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song, or playlist. Supports URLs and search queries.')
    .addStringOption(option => 
        option.setName('song')
            .setDescription('The song you want to play')
            .setRequired(true)
    );

export async function run({interaction, client, handler}: SlashCommandProps) {
    const song = interaction.options.getString('song');
    let player = client.musicManager.players.get(interaction.guildId!);
    const member = interaction.member as GuildMember;
    const channel: any = member.voice.channel;

    if(!player)
        player = await MusicHelper.createPlayer(interaction);

    if(!channel.permissionsFor(interaction.guild?.members.me).has(PermissionsBitField.Flags.Connect)) {
        const embed = EmbedGenerator.ChannelLocked('Please give me permission to join your channel, or select a different channel.');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    try {
        const member = interaction.member as GuildMember;
        const results = await MusicHelper.playSong(member, song as string, player);
        const embed = player.queue.length > 0? EmbedGenerator.QueuedEmbed(results.tracks[0]) : EmbedGenerator.PlayEmbed(results.tracks[0]);
        await interaction.reply({ embeds: [embed] });
        
    } catch (err: any) {
        LogHelper.error(err);
        const embed = EmbedGenerator.Error(err.message);
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
    }

    return;
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}