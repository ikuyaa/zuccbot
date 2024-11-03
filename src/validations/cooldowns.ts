import {ValidationProps} from 'commandkit';
import { MessageHelper, Time } from '../helpers/Helpers';
import { Collection, EmbedBuilder, Colors} from 'discord.js';
import client from '../index';

export default async function ({interaction, commandObj, handler}: ValidationProps) {
    if(handler.devUserIds.includes(interaction.user.id))
        return false;


    if(!interaction.isChatInputCommand())
        return;

    const cooldowns: Collection<string, any> = client.cooldowns;
    const cooldown: string = commandObj.options?.cooldown;
    const { user } = interaction;

    if (!cooldown) {
        return;
    }

    const commandName = commandObj.data.name;

    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    }

    const now: number = Date.now();
    const timestamps: Collection<string, number> = cooldowns.get(commandName);
    const cooldownAmount: number = parseCooldown(cooldown);

    if(timestamps.has(user.id)) {
        //Calculate the expiration time
        const expirationTime: number = timestamps.get(user.id)! + cooldownAmount;

        //Checking if the cooldown has expired
        if(now < expirationTime){
            const timeLeft: number = (expirationTime - now) / 1000;
            const timeLeftFormatted: string = formatTimeLeft(timeLeft);

            const embed = new EmbedBuilder()
            .setTitle('⏲️  Cooldown')
            .setDescription(`Please wait ${timeLeftFormatted} before using \`/${commandObj.data.name}\` again.`)
            .setColor(Colors.Red);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            MessageHelper.DeleteTimed(interaction, 5000);
            return true; //Never delete this
        }
    } else {
        timestamps.set(user.id, now);
        setTimeout(() => timestamps.delete(user.id), cooldownAmount);
        return false;
    }
}

function parseCooldown(cooldown: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = cooldown.match(regex);

    if(!match){
        throw new Error('Invalid cooldown format. Please use a valid format like 5s, 10m, 1h, 2d.');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's':
            return Time.secs(value); //Converting seconds to milliseconds
        case 'm':
            return Time.mins(value); //Converting minutes to milliseconds
        case 'h':
            return Time.hours(value); //Converting hours to milliseconds
        case 'd':
            return Time.days(value); //Converting days to milliseconds
        default:
            throw new Error('Invalid cooldown format. Please use a valid format like 5s, 10m, 1h, 2d.');
    }
}

function formatTimeLeft(timeLeft: number): string {
    if (timeLeft < 60) {
        return `${timeLeft.toFixed(1)} second(s)`;
    } else if (timeLeft < 3600) {
        const mins = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${mins} minute(s) and ${seconds.toFixed(1)} second(s)`;
    } else if (timeLeft < 86400) {
        const hours = Math.floor(timeLeft / 3600);
        const mins = Math.floor((timeLeft % 3600) / 60);
        return `${hours} hour(s) and ${mins} minute(s)`;
    } else {
        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        return `${days} day(s) and ${hours} hour(s)`;
    }
}