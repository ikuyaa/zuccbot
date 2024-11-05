# Music Bot


### **Please Note**
I'm not a programming expert, I am a student. I made this project to practice. The code may not be perfect, but the bot *should* work without major bugs. If you find any bugs please open an issue and I'll get to it ASAP.

## Features
- Play Youtube, or Soundcloud, tracks.
- Queue Playlist
- Change the player's volume

## Commands
- /play
- /pause
- /skip
- /stop
- /previous
- /volume

## Requirements
- LavaLink server (You can find public ones here if you wish to not host your own: https://lavalink.darrennathanael.com/)
- MongoDB (Only if you plan to use the bot with mongo, there is a local database option using nedb-promises in the .env file)

## Things to note
- Make sure to rename example.env to .env and fill it out.

- At this time, the bot only support Youtube and Soundcloud links, and will use Youtube as a search default if a link is not provided.

- If you do not run /setup, anyone will be able to play music. Use /setup to set a DJ role.

- You can use MongoDB by setting the .env variable "DB_TYPE" to "MONGO", or a locally stored DB using nedb-promises by changing "DB_TYPE" to "LOCAL". I'd recommend using "LOCAL" if you do not plan to use this in **a lot** of servers.

- If you just want to play music by commands, you do not need to run /setup, or use a database. This command is only neccesary if you want to use the dedicated music channel feature, or set a DJ role. Make sure to set the "DB_TYPE" variable in the .env file to "LOCAL" if you plan to use the bot this way.

## Installation
⁣1. Create a bot from the Discord Developer Portal
2. Go to the Bot tab in your bot's application menu and make sure all the bot's intents are enabled.
<img src=https://i.imgur.com/sNBBl58.png" alt="Required Intents" width="100" height="100"/>

## TODO List
- Create a Dockerfile

- Add music looping

- Add caching via redis (maybe)
