import { ValidationProps } from "commandkit";
import { EmbedGenerator, GuildHelper, MessageHelper, Time, UserHelper } from "../helpers/Helpers";
import {GuildMember} from "discord.js";

export default async function ({interaction, commandObj, handler}: ValidationProps) {
    if(!interaction.guildId)
        return;
    
    const guildId = interaction.guildId;

    if(!await GuildHelper.GuildHasDJRole(guildId)) {
        return false;
    }

    const djRoleId: string = await GuildHelper.GetDjRoleId(guildId) as string;
    const member: GuildMember = interaction.member as GuildMember;

    //If user is an admin, they can use the command regardless.
    if(await UserHelper.isUserAdmin(guildId, member.id))
        return false;

    //If the user does not have the dj role, they cannot use any commands.
    if(!member.roles.cache.has(djRoleId)) {
        if(!interaction.isRepliable())
            return true;

        if(!interaction.deferred)
            await interaction.deferReply({ephemeral: true});

        const embed = EmbedGenerator.Error(`You must have the DJ role to use commands for ${process.env.BOT_NAME}.`);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
        MessageHelper.DeleteTimed(interaction, Time.secs(10));
        return true;
    }

}