import {Client, Message, GuildMember, PermissionsBitField, VoiceBasedChannel} from "discord.js";
import { KazagumoPlayer } from "kazagumo";
import {LogHelper, MusicHelper, EmbedGenerator, MessageHelper, Time, GuildHelper} from "../../../helpers/Helpers";

export default async (message: Message, client: Client) => {
    //Making sure we don't respond to ourselves.
    if(message.author.bot) 
        return;

    //Making sure the guild is setup
    if(!await GuildHelper.IsGuildRegistered(message.guild?.id as string)) {
        const embed = EmbedGenerator.Error('This server is not setup. Please run `/setup` to setup the server.');
        await message.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(message, Time.secs(10));
        await message.delete();
        return;
    }

    const musicMessageId: string | null = await GuildHelper.GetMainMusicMessageId(message.guildId as string);
    const currentChannelId: string = message.channel.id as string;
    const musicChannelId: string | null = await GuildHelper.GetMainMusicChannelId(message.guildId as string);

    //Making sure we're in the music channel
    if(!musicChannelId || currentChannelId !== musicChannelId) {
        return;
    }


    const channel: VoiceBasedChannel = message.member?.voice.channel as VoiceBasedChannel;
    const song = message.content;
    let player: KazagumoPlayer | undefined = client.musicManager.players.get(message.guild?.id as string);

    if(!channel) {
        const embed = EmbedGenerator.Error('You must be in a voice channel to play music.');
        const errorMsg: Message = await message.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(errorMsg, Time.secs(10), true);
        await message.delete();
        return;
    }

    //Making sure we have the permission to join the voice channel.
    if(!channel.permissionsFor(message.guild?.members.me as any).has(PermissionsBitField.Flags.Connect)) {
        try {
            const embed = EmbedGenerator.ChannelLocked('Please give me permission to join your channel, or select a different channel.');
            const errorMsg: Message = await channel.send({ embeds: [embed] });
            MessageHelper.DeleteTimed(errorMsg, Time.secs(10), true);
            return;
        } catch (err: any) {
            LogHelper.error(err);
            return;
        }
    }

    //Making sure there is a player, if not we're creating one
    if(!player)
        player = await MusicHelper.createPlayerFromMessage(message);

    try {
        const member = message.member as GuildMember;
        const results = await MusicHelper.playSong(member, song, player, channel);

        if(results.tracks.length === 0) {
            await message.delete();
            const embed = EmbedGenerator.Error('No tracks found.');
            const errorMsg: Message = await message.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(errorMsg, Time.secs(10), true);
            return;
        }

        //Making sure the music message Id exists
        if(!musicMessageId) {
            const embed = EmbedGenerator.Error('Music embed not found. Please make sure you have ran `/setup`. If you have, please run `/reset` and try again.');
            await message.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(message, Time.secs(20));
            return;
        }

        const musicMessage: Message = await message.channel.messages.fetch(musicMessageId);

        //Making sure the music message exists.
        if(!musicMessage) {
            const embed = EmbedGenerator.Error('Music embed not found. Please make sure you have ran `/setup`. If you have, please run `/reset` and try again.');
            await message.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(message, Time.secs(20));
            return;
        }

        const currentEmbed: any = musicMessage.embeds[0];
        const newEmbed = EmbedGenerator.NowPlaying(currentEmbed, musicMessage, player);
        await musicMessage.edit({ embeds: [newEmbed], components: [client.ActionRows.PlayRow as any] });
        await message.delete();
        return;

    } catch (err: any) {
        LogHelper.error(err);
        const embed = EmbedGenerator.Error(err.message as string);
        const replyMsg: Message = await message.reply({ embeds: [embed] });
        await message.delete();
        MessageHelper.DeleteTimed(replyMsg, Time.secs(10), true);
        return;
    }
}