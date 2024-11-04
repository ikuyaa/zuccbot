import {Interaction, InteractionWebhook, Message} from "discord.js";
import client from "../../../index";
import { GuildHelper, EmbedGenerator, MusicHelper } from "../../../helpers/Helpers";
import { KazagumoPlayer } from "kazagumo";

export default async (interaction: Interaction) => {
    if(!interaction.isButton())
        return;

    const validIds = [
        'music-pause',
        'music-play',
        'music-stop',
        'music-skip',
        'music-previous',
    ];

    if(!validIds.includes(interaction.customId))
        return;

    const player: KazagumoPlayer | undefined = client.musicManager.players.get(interaction.guildId as string);

    if(!player) {
        await interaction.deferUpdate();
        await interaction.editReply({ embeds: [EmbedGenerator.MusicDefault()]});
        return;
    }

    if(!interaction.deferred)
        await interaction.deferUpdate();

    switch(interaction.customId) {
        case 'music-pause':
            await interaction.editReply({ components: [client.ActionRows.PauseRow as any] });
            await MusicHelper.pauseSong(player, interaction, true);
            break;

        case 'music-play':
            await interaction.editReply({ components: [client.ActionRows.PlayRow as any] });
            await MusicHelper.pauseSong(player, interaction, true);
            break;

        case 'music-stop':
            await MusicHelper.stopPlayer(player, interaction, true);
            break;

        case 'music-skip':
            await MusicHelper.skipSong(player, interaction, true);
            break;

        case 'music-previous':
            await MusicHelper.playPrevious(player, interaction, true);
            break;
    }
}