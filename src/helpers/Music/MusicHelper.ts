import {CommandInteraction, GuildMember, Interaction} from "discord.js";
import {Kazagumo, KazagumoPlayer, KazagumoSearchResult} from "kazagumo";
import client from "../../index";
import {LogHelper} from "../Helpers";
import {PlayOptions} from "shoukaku";
import {EmbedGenerator, MessageHelper, Time} from "../Helpers";

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

    public static async skipSong(player: KazagumoPlayer | undefined, interaction: Interaction) {
    if(!interaction.isRepliable())
        return;

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

    public static async pauseSong(player: KazagumoPlayer | undefined, interaction: Interaction) {
        if(!interaction.isRepliable())
            return;

        if(!player) {
            const embed = EmbedGenerator.Error('No player found. Are you playing any music?');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        }

        if(!player.queue.current) {
            const embed = EmbedGenerator.Error('No song is currently playing.');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
            return;
        }

        if(player.paused) {
            player.pause(false);
            const embed = EmbedGenerator.PausedEmbed(false, player.queue.current);
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        } else {
            player.pause(true);
            const embed = EmbedGenerator.PausedEmbed(true, player.queue.current);
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        }

        return;
    }

    public static async stopPlayer(player: KazagumoPlayer | undefined, interaction: Interaction) {
        if(!interaction.isRepliable())
            return;

        if(player) {
            player.destroy();
            const embed = EmbedGenerator.Success('Player stopped.');
            await interaction.reply({ embeds: [embed] });
            MessageHelper.DeleteTimed(interaction, Time.secs(10));
        }
    }
}