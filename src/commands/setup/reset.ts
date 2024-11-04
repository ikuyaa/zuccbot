import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, Interaction } from 'discord.js';
import {EmbedGenerator, GuildHelper, LogHelper, MessageHelper, Time, UserHelper} from "../../helpers/Helpers";


export const data = new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Resets the bot to its default state.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });
    const guildId = interaction.guildId as string;
    const userId = interaction.user.id;

    //Check if the user has the required permissions.
    if(!await UserHelper.isUserAdmin(guildId, userId)) {
        const embed = EmbedGenerator.Error(`You must be an administrator to reset ${process.env.BOT_NAME}.`);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return;
    }

    //Making the embed and buttons to send
    const embed = EmbedGenerator.Warning('Resetting the bot will delete all data associated with this bot and return it to its default state. Are you sure you want to continue?');
    const buttons: any = {
        resetYes: new ButtonBuilder()
            .setCustomId('reset-yes')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Success),

        resetNo: new ButtonBuilder()
            .setCustomId('reset-no')
            .setLabel('No')
            .setStyle(ButtonStyle.Danger),
    }
    
    //Creating the action row
    const actionRow: any = new ActionRowBuilder().addComponents(buttons.resetYes, buttons.resetNo);

    if(!interaction.isRepliable())
        return;

    //Sending the message
    const message: Message = await interaction.editReply({ embeds: [embed], components: [actionRow as any] });

    //Making the collector for the button for 10 minutes
    const filter = (i: any) => i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: Time.mins(10) });

    collector.on('collect', async (i: Interaction) => {
        if(!i.isButton()) 
            return;

        switch(i.customId) {
            case 'reset-yes':
                await i.deferUpdate();
                try {
                    const mainMessage: Message = await GuildHelper.GetMainMusicMessage(interaction.guildId as string) as Message;
                    await mainMessage?.delete();
                    await GuildHelper.DeleteGuild(interaction.guildId as string);
                    const embed = EmbedGenerator.Success('Bot has been reset successfully.');
                    await i.editReply({ embeds: [embed], components: [] });
                    MessageHelper.DeleteTimed(i, Time.secs(10));
                    return;
                } catch (err: any) {
                    LogHelper.error(err);
                    const embed = EmbedGenerator.Error('An error occurred while trying to reset the bot. Please try again.');
                    await i.editReply({ embeds: [embed], components: [] });
                    MessageHelper.DeleteTimed(i, Time.secs(10));
                    collector.stop('Reset Yes Error');
                }

                break;

            case 'reset-no':
                await i.deferUpdate();
                const embed = EmbedGenerator.Cancel('Reset cancelled.');
                await i.editReply({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(i, Time.secs(10));
                collector.stop('Reset No');
                break;
        }
    });

    collector.on('end', async (collected, reason) => {
        switch(reason) {
            case 'time':
                const embed = EmbedGenerator.Error('You took too long to respond. Please try again.');
                await interaction.editReply({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(interaction, Time.secs(10));
                break;
        }
    });

}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}