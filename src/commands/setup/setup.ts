import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message, ActionRow, Interaction, ActionRowBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, InteractionResponse, ChannelType, ButtonBuilder, ButtonStyle, Channel } from 'discord.js';
import { EmbedGenerator, LogHelper, MessageHelper, UserHelper } from "../../helpers/Helpers";
import { GuildHelper, Time } from "../../helpers/Helpers";
import {IGuild} from "../../models/Guilds/Guild";
import client from "../../index";

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription(`Setup ${process.env.BOT_NAME} for your server.`);

export async function run({interaction, client, handler}: SlashCommandProps) {
    /*
    *   The main function that runs the setup command.
    *   1. Get all the required information from the interaction.
    *   2. Check if the user has the required permissions.
    *   3. Check if the server is already setup.
    *   4. If the server is not setup, continue with the setup process.
    *   5. Create a listener, and its events, for the interaction that expires in 10 mins.
    */

    if(!interaction.isCommand())
        return;

    //1. Get all the required information from the interaction.
    const guildId: string | null = interaction.guild?.id as string;
    const userId: string| null = interaction.user?.id as string;

    //Making sure we have the required information.
    if(!guildId || !userId) {
        return interaction.reply({ content: `An error occured while trying to setup the bot.`, ephemeral: true});
    }

    //2. Check if the user has the required permissions.
    if(!await UserHelper.isUserAdmin(guildId, userId)) {
        const embed = EmbedGenerator.Error(`You must be an administrator to setup ${process.env.BOT_NAME}.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    //3. Check if the server is already setup.
    if(await GuildHelper.IsGuildRegistered(guildId)) {
        const embed = EmbedGenerator.Error(`This server is already setup.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    //4. If the server is not setup, continue with the setup process.
    const embed = EmbedGenerator.Warning(`This server is not setup for ${process.env.BOT_NAME}. Would you like to setup the server?\n\n ${process.env.BOT_NAME} will need a channel to play music in. Please make sure you have a music channel setup before continuing. \n\n **Please note:** ${process.env.BOT_NAME} will store required information in our database to ensure the bot is always running with the required information. ${process.env.BOT_NAME} will not store any personal information.`);

    const actionRow: any = client.ActionRows.SetupRow;

    const message: Message = await interaction.reply({ embeds: [embed], components: [actionRow] , fetchReply: true, ephemeral: true });

    //5. Create a listener, and making the events, for the interaction that expires in 10 mins.
    const filter: any = (i: CommandInteraction) => i.user.id === userId;
    const collector = message.createMessageComponentCollector({ filter, time: Time.mins(10) });

    collector.on('collect', async (i: Interaction) => {
        if(!i.isButton())
            return;

        switch(i.customId) {
            case 'setup-confirm':
                await i.deferUpdate();
                try {
                    await setupGuild(i);
                    break;
                } catch (err: any) {
                    LogHelper.log(`❌ Error setting up guild. ${err.message}`);
                    const embed = EmbedGenerator.Error(`An error occured while trying to setup the server. Please try again later.`)
                    await i.editReply({ embeds: [embed], components: [] });
                    MessageHelper.DeleteTimed(message, Time.secs(10));
                }
                collector.stop();
                break;

            case 'setup-cancel':
                await i.deferUpdate();
                const embed = EmbedGenerator.Cancel(`The setup process has been cancelled. Run \`/setup\` to start the setup process again.`);
                await i.editReply({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(message, Time.secs(10));
                collector.stop();
                break;
        }
    });

    collector.on('end', async (collected, reason) => {
        switch(reason) {
            case 'time':
                const embed = EmbedGenerator.Error(`The setup process has timed out. Please run the /setup command again.`);
                await message.edit({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(message, Time.secs(10), true);
                break;
        }
    });

}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}

async function setupGuild(interaction: Interaction): Promise<IGuild | undefined> {
    /*
    *   This function will setup the guild in the database.
    *   1. Send a new reply asking for the music channel.
    *   2. Once the user selects the music channel, store it in the database.
    *   3. Edit the reply and ask if the user wants to setup the DJ role.
    *   4. If the user selects yes, ask for the DJ role.
    *   5. Store the DJ role in the database.
    *   
    */

    if(!interaction.isRepliable()) {
        LogHelper.log(`❌ Error setting up guild. Interaction is not repliable.`);
        return;
    }

    const guildId: string = interaction.guild?.id as string;
    const userId: string = interaction.user.id;

    //Embeds
    const setupChannelEmbed = EmbedGenerator.Alert(`Do you want to setup a music channel for ${process.env.BOT_NAME}?`);
    const selectChannelEmbed = EmbedGenerator.Alert(`Please select the music channel for ${process.env.BOT_NAME}.\n\n This message will expire in 10 minutes.`);
    const djAskEmbed = EmbedGenerator.Alert(`Would you like to setup a DJ role for ${process.env.BOT_NAME}?\n\n **Please note:** The DJ, or Administrator, role is required to use **ANY** of the music commands.\n\nYou can select no, and anyone can use the music commands.`);
    const djSelectEmbed = EmbedGenerator.Alert(`Please select the DJ role for ${process.env.BOT_NAME}.`);

    //Select Menus
    const channelOption: ChannelSelectMenuBuilder = new ChannelSelectMenuBuilder()
        .setCustomId('music-channel')
        .setPlaceholder('Select a channel')
        .setMinValues(1)
        .addChannelTypes(ChannelType.GuildText)

    const roleOption: RoleSelectMenuBuilder = new RoleSelectMenuBuilder()
        .setCustomId('dj-role')
        .setPlaceholder('Select a role')
        .setMinValues(1);

        
    //Buttons
    const channelYesBtn: ButtonBuilder = new ButtonBuilder()
        .setCustomId('channel-yes')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Success)

    const channelNoBtn: ButtonBuilder = new ButtonBuilder()
        .setCustomId('channel-no')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger)

    const djYesBtn: ButtonBuilder = new ButtonBuilder()
        .setCustomId('dj-yes')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Success)

    const djNoBtn: ButtonBuilder = new ButtonBuilder()
        .setCustomId('dj-no')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger)

    //Action Rows
    const channelAskRow: any = new ActionRowBuilder().addComponents(channelYesBtn, channelNoBtn);
    const channelRow: any = new ActionRowBuilder().addComponents(channelOption);
    const djRoleRow: any = new ActionRowBuilder().addComponents(roleOption);
    const djAskRow: any = new ActionRowBuilder().addComponents(djYesBtn, djNoBtn);

    //Send a new reply asking for the music channel.
    const message: Message = await interaction.editReply({ embeds: [setupChannelEmbed], components: [channelAskRow] });

    //New object for the guild.
    const newGuild: IGuild = {} as IGuild;
    newGuild.guildId = guildId;
    newGuild.registeredBy = userId;

    //Interaction Collector
    const filter: any = (i: CommandInteraction) => i.user.id === userId;
    const collector = message.createMessageComponentCollector({ filter, time: Time.mins(10) });

    let channelSelected: boolean = false;

    collector.on('collect', async (i: Interaction) => {
        if(i.isChannelSelectMenu()) { //Called after the channel is selected.
            await i.deferUpdate();
            const channelId = i.values[0];
            newGuild.musicChannelId = channelId;
            await i.editReply({ embeds: [djAskEmbed], components: [djAskRow] });
            
        } else if (i.isRoleSelectMenu()) { //Called after the dj role is selected
            await i.deferUpdate();
            const roleId = i.values[0];
            newGuild.djRoleId = roleId;
            collector.stop("setup-complete");
        } else if (i.isButton()) { //Called after a button is selected
            await i.deferUpdate();
            switch(i.customId) {
                case 'channel-yes':
                    channelSelected = true;
                    await i.editReply({ embeds: [selectChannelEmbed], components: [channelRow] });
                    break;

                case 'channel-no':
                    await i.editReply({embeds: [djAskEmbed], components: [djAskRow]});
                    break;

                case 'dj-yes':
                    await i.editReply({ embeds: [djSelectEmbed], components: [djRoleRow] });
                    break;

                case 'dj-no':
                    collector.stop("dj-no");
                    break;
            }
        }

    });

    collector.on('end', async (collected, reason) => {
        switch(reason) {
            case 'time':
                const embed = EmbedGenerator.Error(`The setup process has timed out. Please run the /setup command again.`);
                await message.edit({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(message, Time.secs(10), true);
                break;

            case 'dj-no':
                newGuild.djRoleId = undefined;
                await completeSetup(newGuild, interaction, channelSelected);
                return newGuild;

            case 'setup-complete':
                await completeSetup(newGuild, interaction, channelSelected);
                return newGuild;
        }
    });

}

async function completeSetup(newGuild: IGuild, interaction: Interaction, channelSelected: boolean) {
    if(!interaction.isRepliable())
        return;

    await GuildHelper.RegisterGuild(newGuild);
    const setupSuccessEmbed = EmbedGenerator.Success(`The setup process has been completed. ${process.env.BOT_NAME} is now setup for this server. Enjoy!`);
    await interaction.editReply({ embeds: [setupSuccessEmbed], components: [] });
    MessageHelper.DeleteTimed(interaction, Time.secs(10), true);

    if(channelSelected) {
        const channel: Channel = interaction.guild?.channels.cache.get(newGuild.musicChannelId as string) as Channel
        if(channel) {
            const embed = EmbedGenerator.MusicDefault();
            if(!channel.isSendable()) { //If we can't send to the required channel, send a message to the interaction.
                const embed = EmbedGenerator.ChannelLocked(`I don't have permission to send messages in the music channel. Please make sure I have the required permissions.`);
                const message: Message = await interaction.followUp({ embeds: [embed] });
                MessageHelper.DeleteTimed(message, Time.secs(10), true);
                return;
            }

            const row: any = client.ActionRows.PauseRow;

            const mainMsg: Message = await channel.send({ embeds: [embed], components: [row] });
            newGuild.musicMessageId = mainMsg.id;
            await GuildHelper.UpdateGuild(newGuild);
            return;
        }
    } else {
        return;
    }
}