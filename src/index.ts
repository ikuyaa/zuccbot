import {Client, GatewayIntentBits, Collection, ButtonBuilder, ButtonStyle, ActionRowBuilder} from "discord.js";
import 'dotenv/config';
import { CommandKit } from 'commandkit';
import { Kazagumo, KazagumoPlayer, KazagumoQueue, Plugins } from 'kazagumo';
import { Shoukaku, Connectors, NodeOption, ShoukakuOptions, PlayerUpdate } from 'shoukaku';
import { DBHelper, Time } from "./helpers/Helpers";
import MusicEvents from "./events/music events/MusicEvents";

declare module 'discord.js' {
    interface Client {
        cooldowns: Collection<string, any>;
        musicManager: Kazagumo;
        SetupButtons: { [key: string]: ButtonBuilder };
        MusicButtons: { [key: string]: ButtonBuilder };
        ActionRows: { [key: string]: ActionRowBuilder }
    }
}

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true,
    },
});

new CommandKit({
    client,
    devGuildIds: [],
    devUserIds:['121034768568549378'],
    devRoleIds:[''],
    eventsPath: `${__dirname}/events/discord events`,
    commandsPath: `${__dirname}/commands`,
    validationsPath: `${__dirname}/validations`,
});

//Making database connection
if(process.env.DB_TYPE?.toUpperCase() === 'MONGO')
    DBHelper.connect();

//Creating a collector for cooldown commands
client.cooldowns = new Collection();


//Lavalink Nodes
const Nodes: NodeOption[] = [
    {
    name: 'Home' as string,
    url: process.env.LAVALINK_URL as string,
    auth: process.env.LAVALINK_PASSWORD as string,
    secure: process.env.LAVALINK_SECURE === 'true' ? true : false,
    },
];

const shoukakuSettings: ShoukakuOptions = {
    voiceConnectionTimeout: Time.mins(15),
}

//Making the music manager
client.musicManager = new Kazagumo({
    defaultSearchEngine: 'youtube',
    plugins:[ new Plugins.PlayerMoved(client), ],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if(guild) 
            guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes, shoukakuSettings);

//Music Events
client.musicManager.on('playerCreate', (player: KazagumoPlayer) => {
    MusicEvents.onPlayerCreate(player);
});

client.musicManager.shoukaku.on('ready', (name: string) => {
    MusicEvents.onMusicReady(name);
});

client.musicManager.shoukaku.on('error', (name: string, error: any) => {
    MusicEvents.onMusicError(name, error);
});


client.SetupButtons = {
    SetupCancel: new ButtonBuilder()
        .setCustomId('setup-cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger),

    SetupConfirm: new ButtonBuilder()
        .setCustomId('setup-confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Success),
} as { [key: string]: ButtonBuilder };

client.MusicButtons = {
    Play: new ButtonBuilder()
        .setCustomId('music-play')
        .setLabel(`▶️`)
        .setStyle(ButtonStyle.Secondary),

    Pause: new ButtonBuilder()
        .setCustomId('music-pause')
        .setLabel(`⏸️`)
        .setStyle(ButtonStyle.Secondary),

    Stop: new ButtonBuilder()
        .setCustomId('music-stop')
        .setLabel(`⏹️`)
        .setStyle(ButtonStyle.Secondary),

    Skip: new ButtonBuilder()
        .setCustomId('music-skip')
        .setLabel(`⏭️`)
        .setStyle(ButtonStyle.Secondary),
} as { [key: string]: ButtonBuilder };

client.ActionRows = {

    //The action row that shows when the music is paused.
    PauseRow: new ActionRowBuilder()
        .addComponents(client.MusicButtons.Play, client.MusicButtons.Stop, client.MusicButtons.Skip) as ActionRowBuilder,

    //The action row that shows when the music is playing.
    PlayRow: new ActionRowBuilder()
        .addComponents(client.MusicButtons.Pause, client.MusicButtons.Stop, client.MusicButtons.Skip) as ActionRowBuilder,

    //The action row that shows when the setup needs to be confirmed from the /setup command.
    SetupRow: new ActionRowBuilder()
        .addComponents(client.SetupButtons.SetupConfirm, client.SetupButtons.SetupCancel) as ActionRowBuilder,

} as { [key: string]: ActionRowBuilder };

client.login(process.env.DISCORD_TOKEN);

export default client;