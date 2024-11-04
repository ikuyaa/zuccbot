import { GuildMember, Interaction, Message, Presence, VoiceBasedChannel, VoiceChannel, VoiceState} from "discord.js";
import { KazagumoPlayer, KazagumoSearchResult } from "kazagumo";
import client from "../../index";
import { EmbedGenerator, MessageHelper, Time } from "../Helpers";

export default class MusicHelper {
    public static async createPlayer(interaction: Interaction): Promise<KazagumoPlayer> {
        const member: GuildMember = interaction.member as GuildMember;

        const player = await client.musicManager.createPlayer({
            guildId: interaction.guildId as string,
            textId: interaction.channelId as string,
            voiceId: member?.voice.channelId as string,
            volume:  Number(process.env.DEFAULT_VOLUME),
            deaf: true as boolean,
        });

        return player;
    }

    public static async createPlayerFromMessage(message: Message) : Promise<KazagumoPlayer> {
        const member = message.member as GuildMember;

        const player = await client.musicManager.createPlayer({
            guildId: message.guildId as string,
            textId: message.channelId as string,
            voiceId: member?.voice.channelId as string,
            volume: Number(process.env.DEFAULT_VOLUME),
            deaf: true as boolean,
        });

        return player;
    }

    public static async playSong(member: GuildMember, song: string, player: KazagumoPlayer, channel: VoiceBasedChannel): Promise<KazagumoSearchResult> {
        try {
            if(!player || !song)
                throw new Error('Invalid player or song provided.');
    
            if(!channel)
                throw new Error('You must be in a voice channel to play music.');
            let results: KazagumoSearchResult = await client.musicManager.search(song, { requester: member.user });

            if(results.tracks.length === 0)
                throw new Error('No tracks found.');
    
            if(results.type === 'PLAYLIST') {
                player.queue.add(results.tracks);
            } else {
                player.queue.add(results.tracks[0]);
            }

            if(!player.playing || !player.paused && !player.queue.current)
                await player.play();
    
            return results;
        } catch (err: any) {
            throw new Error(err);
        }
        
    }

    public static async skipSong(player: KazagumoPlayer | undefined, interaction: Interaction, fromButton: boolean = false) {
    if(!interaction.isRepliable())
        return;

    if(!player) {
        if(fromButton)
            return;

        const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, 10);
        return;
    }

    if(!player?.queue.current) {
        if(fromButton)
            return;

        const embed = EmbedGenerator.Error('No song is currently playing.');
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, 10);
        return;
    }

    player?.skip();
    if(player?.queue.length === 0) {
        player.destroy();

        if(fromButton)
            return;

        const embed = EmbedGenerator.NoMoreTracks();
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    } else {
        if(fromButton) {
            return;
        }

        const embed = EmbedGenerator.PlayEmbed(player?.queue[0]);
        await interaction.reply({ embeds: [embed] });
        return;
    }
    }

    public static async pauseSong(player: KazagumoPlayer | undefined, interaction: Interaction, fromButton: boolean = false) {
        if(!interaction.isRepliable())
            return;

        if(!player) {
            if(fromButton)
                return;

            const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        }

        if(!player.queue.current) {
            if(fromButton)
                return;
            const embed = EmbedGenerator.Error('No song is currently playing.');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        }

        if(player.paused) {
            player.pause(false);

            if(fromButton)
                return;

            const embed = EmbedGenerator.PausedEmbed(false, player.queue.current);
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        } else {
            player.pause(true);

            if(fromButton)
                return;

            const embed = EmbedGenerator.PausedEmbed(true, player.queue.current);
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        }

        return;
    }

    public static async stopPlayer(player: KazagumoPlayer | undefined, interaction: Interaction, fromButton: boolean = false) {
        if(!interaction.isRepliable())
            return;

        if(player) {
            player.destroy();

            if(fromButton)
                return;

            const embed = EmbedGenerator.Success('Player stopped.');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        }
    }

    public static async setVolume(player: KazagumoPlayer | undefined, interaction: Interaction, volume: number) {
        if(!interaction.isRepliable())
            return;

        player?.volume == volume;

        const embed = EmbedGenerator.Success(`Volume set to ${volume}\nThis change will work on the next song.`);
        await interaction.reply({ embeds: [embed] });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    public static async playPrevious(player: KazagumoPlayer | undefined, interaction: Interaction, fromButton: boolean = false) {
        if(!interaction.isRepliable())
            return;

        const previous = player?.getPrevious();

        if(!previous) {
            if(fromButton)
                return;

            const embed = EmbedGenerator.Error('No previous song found.');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        }

        await player?.play(player.getPrevious(true));

        if(fromButton)
            return;

        const embed = EmbedGenerator.PlayEmbed(previous);
        await interaction.reply({ embeds: [embed] });
        return;
    }
}