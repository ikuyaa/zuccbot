# zuccbot 🎶


### **Please Note**
I'm not a programming expert, I am a student. I made this project to practice. The code may not be perfect, but the bot *should* work without major bugs. If you find any bugs please open an issue and I'll get to it ASAP.\
This bot is in **BETA** please expect some features you may want to be missing. Feel free to open a discussion if you have any request! If you enjoy the bot please leave a star! :star:

## Table of Contents
- [Features](#features)
- [Commands](#commands)
- [Requirements](#requirements)
- [Things to note](#things-to-note)
- [Installation](#installation)
- [FAQ](#faq)
- [Planned Features](#planned-features)


## Features
- Play Youtube or Soundcloud tracks.
- Queue Playlist
- Change the player's volume
- Dedicated music channel where you can paste links or use search queries. (Inspired by Hydra Bot.)<br /><img src="https://i.imgur.com/6PFHfGJ.png" alt="Music Embed" width="250" height="250">
- Set a DJ role to lock all commands behind.

## Commands
- `/play` - Plays a song by, or queues one if one is playing, URL (Youtube / Souncloud) or by a text search (Uses Youtube to search)
- `/pause` - Pauses, or unpauses, the player based on it's current paused state.
- `/skip` - Skips the current song. If the queue is empty, the player will be destroyed.
- `/stop` - Stops the current song, and destroys the player and clears the queue.
- `/previous` - Plays the previous song.
- `/volume` - Changes the volume of the music playback between 1-100%. (Changes will take effect on the next song)
- `/queue` - Displays the player's current queue.
- `/setup` - Sets up the bot to use a dedicated music channel, or a DJ role. 
- `/reset` - Resets the bot to it's default state, removing the server from the database.

## Requirements
- NodeJS v18 or later.
- LavaLink v4+ server with the [youtube-source](https://github.com/lavalink-devs/youtube-source) plugin. (You can find public servers here if you wish to not host your own: https://lavalink.darrennathanael.com/)
- MongoDB (Only if you plan to use the bot with mongo, there is a local database option using nedb-promises in the .env file)

## Things to note
- Make sure to rename `example.env` to `.env` and fill it out.

- If you are using "LOCAL" for the DB_TYPE make sure you **ALWAYS** back up the `Guilds.db` file in the `src/localDatabases` folder, or you will lose all information about guilds (DJ roles, Music Channels).

- You can use MongoDB by setting the .env variable "DB_TYPE" to "MONGO", or a locally stored DB using nedb-promises by changing "DB_TYPE" to "LOCAL". I'd recommend using "LOCAL" if you do not plan to use this in **a lot** of servers, or don't want to save your data outside of a local environment. I'd recommend "MONGO" if you don't want to backup Guilds.db everytime you reinstall or update the bot.

- At this time, the bot only support `Youtube` and `Soundcloud` links, and will use Youtube as a search default if a link is not provided.

- If you do not run `/setup`, anyone will be able to play music. Use `/setup` to set a DJ role.

- If you just want to play music by commands, you do not need to run `/setup`, or use a database. This command is only neccesary if you want to use the dedicated music channel feature, or set a DJ role. Make sure to set the "DB_TYPE" variable in the .env file to "LOCAL" if you do not plan to use `/setup`.

## Installation
1. Create a bot from the [Discord Developer Portal](https://discord.com/developers)
2. Go to the Bot tab in your bot's application menu and make sure all the bot's intents are enabled, and then save. <img src="https://i.imgur.com/sNBBl58.png" alt="Requires Intents" width="600" height="150">
3. In the same tab, generate a new Token for the bot. Save it, as this will go into the .env file.
4. Clone the repository to whichever folder you desire, and Unzip it.
5. Run `npm i` inside of the folder that was unzipped to install all the dependencies needed.
6. Either rename, or copy, `example.env` to `.env` and fill it out.
7. Run the `start` script in the package.json with whatever you desire (npm run, pm2, etc..)
8. Make sure the bot is running and ready from the logs
9. Make an invite link in the OAuth2 tab in your bot's developer portal application menu and give it permissions you desire. Make sure at least `Connect`, `Speak`, `Send Messages`, and `Manage Channels` are checked. If you don't want to run into risk with the bot messing up without required permissions, just use `Administrator`. The bot does not have any logic to abuse the Administrator role.
10. Start using slash commands, or run `/setup` to set a DJ role and/or dedicated music channel.


## FAQ
#### :question: The bot won't play certain songs, regardless if I use a link or a search!
Some songs, or videos, on Youtube are either age restricted, or have a warning for "disturbing content" or something or the sorts. This doesn't allow the bot to get the song, as it cannot get passed the warning. Either find a reupload on Youtube without the restrictions, or use Soundcloud.

#### :question: My music channel will not take in links or searches!
Make sure the bot has permission to see the channel you are in. In some cases, when the setup takes place, if the bot cannot see the channel you assigned to be the music channel it cannot store the embed message's ID. Run `/reset`, make sure the bot can see the channel you are assigning, then run `/setup` again. 

## Planned Features
- `/settings` command to change the dj role, or the dedicated music channel.

- Add a boolean option to return search results from a search query incase the wrong song is playing.

- Create a Dockerfile

- Add caching via redis (maybe)
