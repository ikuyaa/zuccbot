import {CommandInteraction, GuildMember, Interaction} from "discord.js";
import {Kazagumo, KazagumoPlayer, KazagumoSearchResult} from "kazagumo";
import client from "../../index";
import {LogHelper} from "../Helpers";
import {PlayOptions} from "shoukaku";

export default class MusicHelper {
    public static async playSong(interaction: Interaction, song: string, player: KazagumoPlayer): Promise<KazagumoSearchResult> {
        try {
            if(!player || !song)
                throw new Error('Invalid player or song provided.');
            
            if(!interaction.isRepliable())
                throw new Error('Interaction is not repliable.');
    
            const member = interaction.member as GuildMember;
            const { channel } = member?.voice;
    
            if(!channel)
                throw new Error('You must be in a voice channel to play music.');
            let results: KazagumoSearchResult = await client.musicManager.search(song, { requester: interaction.user });

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
}