import {PermissionFlagsBits, PermissionsBitField} from 'discord.js';
import client from '../../index';

export default class UserHelper {

    public static async isUserAdmin(guildId: string, userId: string): Promise<boolean> {
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(userId);

        return member.permissions.has(PermissionFlagsBits.Administrator);
    }
}