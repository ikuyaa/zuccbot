import { ActivityType } from 'discord.js';

module.exports = (client: any, handler: any) => {
    client.user.setPresence({
        activities: [{ name: 'music!', type: ActivityType.Playing }],
        status: 'online',
    });
};