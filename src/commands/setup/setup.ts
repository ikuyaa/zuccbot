import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message, ActionRow, Interaction, ActionRowBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, InteractionResponse } from 'discord.js';
import { EmbedGenerator, LogHelper, MessageHelper, UserHelper } from "../../helpers/Helpers";
import { GuildHelper, Time } from "../../helpers/Helpers";

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
                await setupGuild(i);
                break;

            case 'setup-cancel':
                const embed = EmbedGenerator.Cancel(`The setup process has been cancelled. Run \`/setup\` to start the setup process again.`);
                await message.edit({ embeds: [embed], components: [] });
                MessageHelper.DeleteTimed(message, Time.secs(10), true);
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

async function setupGuild(interaction: Interaction) {
    /*
    *   This function will setup the guild in the database.
    *   1. Send a new reply asking for the music channel.
    *   
    */

    if(!interaction.isRepliable()) {
        LogHelper.log(`❌ Error setting up guild. Interaction is not repliable.`);
        return;
    }    
}