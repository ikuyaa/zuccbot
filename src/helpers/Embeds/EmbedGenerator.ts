import { EmbedBuilder, Colors, Message, User } from 'discord.js';
import {KazagumoPlayer, KazagumoSearchResult, KazagumoTrack} from 'kazagumo';

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
    
    public static MusicDefault(): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(`🎶  No Song Playing.`)
            .setImage(process.env.DEFAULT_EMBED_IMAGE as string)
            .setColor(Colors.Blurple)
            .setFooter(null);
    }

    public static NowPlaying(currentEmbed: EmbedBuilder, message: Message, player: KazagumoPlayer): EmbedBuilder {
        const embed = EmbedBuilder.from(currentEmbed);
        const fields: Array<any> = [];
        if(player.queue.length > 0){
            for(const track of player.queue) {
                fields.push({ name: track.title, value: track.author }) 
            }
        }
        const currentTrack: KazagumoTrack = player.queue.current as KazagumoTrack;
        const requester: User = currentTrack.requester as User;
        const title: string =  `🎵  Now playing: ${currentTrack.title}`;
        return embed
            .setTitle(title)
            .setFooter({ text: `Requested by ${requester.tag}`, iconURL: requester.displayAvatarURL() })
            .setImage(currentTrack.thumbnail as string)
            .setFields(fields);
            
    }
}