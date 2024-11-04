import { KazagumoPlayer, KazagumoQueue } from "kazagumo";
import { EmbedGenerator, GuildHelper, LogHelper } from "../../helpers/Helpers";
import { Guild, GuildBasedChannel, GuildChannel, Message, TextChannel } from "discord.js";
import client from "../../index";

export default class MusicEvents {
    public static async onPlayerCreate(player: KazagumoPlayer) {
        LogHelper.log(`New player created in guild ${player.guildId}`);
    }

    public static async onMusicReady(name: string) {
        LogHelper.log(`✔️  Node ${name} is ready!`);
    }

    public static async onMusicError(name: string, error: any) {
        LogHelper.error(`❌  Node ${name} has encountered an error: ${error}`);
    }

    public static async onMusicClose(name: string, code: any, reason: string) {
        LogHelper.error(`❌  Node ${name} has closed with code ${code} and reason ${reason || 'No reason provided'}`);
    }

    public static async onPlayerEnd(player: KazagumoPlayer) {
        // Called when a track ends
        LogHelper.log(`Track ended in guild ${player.guildId}`);
    }

    public static async onPlayerEmpty(player: KazagumoPlayer) {
        //Called when the queue is empty
        LogHelper.log(`Queue is empty in guild ${player.guildId}. Destroying player.`);
        await player.destroy();
    }

    public static async onPlayerStart(player: KazagumoPlayer) {
        const messageId = await GuildHelper.GetMainMusicMessageId(player.guildId);
        const channelId = await GuildHelper.GetMainMusicChannelId(player.guildId);

        if (!messageId || !channelId) return;

        const guild = client.guilds.cache.get(player.guildId);
        const channel = guild?.channels.cache.get(channelId) as TextChannel;

        if (!channel) return;

        const message = await channel.messages.fetch(messageId);

        if (!message) return;

        await message.edit({ embeds: [EmbedGenerator.NowPlaying(message.embeds[0] as any, message, player)] });

        return;
    }

    public static async onPlayerDestroy(player: KazagumoPlayer) {
        //Called when a player is destroyed
        LogHelper.log(`Player destroyed in guild ${player.guildId}`);

        //Updaing the main music message back to the default state
        const messageId: string | null = await GuildHelper.GetMainMusicMessageId(player.guildId);
        const channelId: string | null = await GuildHelper.GetMainMusicChannelId(player.guildId);

        if(!messageId)
            return;

        const guild: Guild | undefined = client.guilds.cache.get(player.guildId);
        const channel: TextChannel | undefined = guild?.channels.cache.get(channelId as string) as TextChannel;
        const mainMessage: Message | undefined = await channel?.messages.fetch(messageId);

        if(!mainMessage)
            return;
        
        const row: any = client.ActionRows.PauseRow;
        const embed = EmbedGenerator.MusicDefault();
        await mainMessage.edit({ embeds: [embed], components: [row] });
        return;
    }

    public static async onQueueUpdate(player: KazagumoPlayer, queue: KazagumoQueue) {

    }

}