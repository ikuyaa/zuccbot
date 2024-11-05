import { EmbedBuilder, Colors, Message, User } from 'discord.js';
import {KazagumoPlayer, KazagumoQueue, KazagumoTrack} from 'kazagumo';

export default class EmbedGenerator {
    public static Warning(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('⚠️  Warning')
            .setDescription(message)
            .setColor(Colors.Yellow);
    }

    public static Error(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('❌  Error')
            .setDescription(message)
            .setColor(Colors.Red);
    }

    public static Success(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('✅  Success')
            .setDescription(message)
            .setColor(Colors.Green);
    }

    public static Cancel(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('❌  Cancel')
            .setDescription(message)
            .setColor(Colors.Red);
    }

    public static Alert(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('❗  Alert')
            .setDescription(message)
            .setColor(Colors.Yellow);
    }

    public static ChannelLocked(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('🔒  I Don\'t have permission to join your channel.')
            .setDescription(message)
            .setColor(Colors.Red);
    }
    
    public static MusicDefault(): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(`🎶  No Song Playing.`)
            .setImage(process.env.DEFAULT_EMBED_IMAGE as string)
            .setColor(Colors.Blurple)
            .setFooter(null);
    }

    public static NowPlaying(currentEmbed: EmbedBuilder, message: Message, player: KazagumoPlayer): EmbedBuilder {
        const currentTrack: KazagumoTrack = player.queue.current as KazagumoTrack;
        const queue = player.queue;
        const embed = EmbedBuilder.from(currentEmbed);
        const fields: Array<any> = [];
        let counter: number = 0;
        if(queue.length > 0){
            fields.push({ name: `**__Queue__**`, value: ` ` });
            for(const track of queue) {
                fields.push({ name: track.title, value: track.author });
                counter++;

                if(counter === 5)
                    break;
            }
                if(queue.length > 5) {
                fields.push({ name: 'And more...', value: `There are ${queue.length - 5} more tracks in the queue.` });
            }
        }
        const requester: User = currentTrack.requester as User;
        const title: string =  `🎵  Now playing: ${currentTrack.title}`;
        return embed
            .setTitle(title)
            .setFooter({ text: `Requested by ${requester.tag}`, iconURL: requester.displayAvatarURL() })
            .setImage(currentTrack.thumbnail as string)
            .setFields(fields);
            
    }

    public static PlayEmbed(track: KazagumoTrack): EmbedBuilder {
        const requester = track.requester as User;

        return new EmbedBuilder()
            .setTitle('🎵  Now Playing')
            .setDescription(`[${track.title}](${track.uri})\n${track.author}`)
            .setThumbnail(track.thumbnail as string)
            .setColor(Colors.Blurple)
            .setFooter({ text: `Requested by ${requester.globalName}`, iconURL: requester.displayAvatarURL() });
    }

    public static QueuedEmbed(track: KazagumoTrack): EmbedBuilder {
        const requester = track.requester as User;

        return new EmbedBuilder()
            .setTitle('🎵  Song Queued')
            .setDescription(`[${track.title}](${track.uri})\n${track.author}\n\nRun \`/queue\` to see the queue.`)
            .setThumbnail(track.thumbnail as string)
            .setColor(Colors.Blurple)
            .setFooter({ text: `Requested by ${requester.globalName}`, iconURL: requester.displayAvatarURL() });
    }

    public static NoMoreTracks(): EmbedBuilder {    
        return new EmbedBuilder()
            .setTitle('🎵  No more tracks in the queue.')
            .setColor(Colors.Blurple);
    }

    public static PausedEmbed(isPaused: boolean, track: KazagumoTrack): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(isPaused? '⏸️  Track Paused' : '▶️  Track Resumed')
            .setDescription(`${track.title}\n${track.author}`)
            .setThumbnail(track.thumbnail as string)
            .setColor(Colors.Blurple);
    }

    public static QueueEmbed(queue: KazagumoQueue) {
        const embed = new EmbedBuilder()
            .setTitle(`🎶  Now Playing ${queue.current?.title} | ${queue.current?.author}`)
            .setColor(Colors.Blurple);
        const fields: Array<any> = [];
        let counter: number = 0;
        if(queue.length > 0){
            fields.push({ name: `**__Queue__**`, value: ` ` });
            for(const track of queue) {
                fields.push({ name: track.title, value: track.author });
                counter++;

                if(counter === 15)
                    break;
            }
                if(queue.length > 15) {
                fields.push({ name: 'And more...', value: `There are ${queue.length - 15} more tracks in the queue.` });
            }
        }

        embed.setFields(fields);
        return embed;

        embed.setFields(fields);
        return embed;
    }
}