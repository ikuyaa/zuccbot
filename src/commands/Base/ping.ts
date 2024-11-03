import { CommandOptions, SlashCommandProps} from "commandkit";
import { SlashCommandBuilder, EmbedBuilder, Colors, CommandInteraction, Message } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot.');

export async function run({interaction, client, handler}: SlashCommandProps) {
    const sent: Message = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });

    const latencey: number = sent.createdTimestamp - interaction.createdTimestamp;

    const pingEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(`🏓 Pong!`)
        .addFields(
            { name:'Latency', value: `${latencey}ms`, inline: true },
            { name:'API Latency', value: `${client.ws.ping}ms`, inline: true }
        )
        .setTimestamp();

    return await interaction.editReply({ content:" " ,embeds: [pingEmbed] });
}

export const options: CommandOptions = {
    cooldown: '10s' as string,
}