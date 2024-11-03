# Music Bot

## Features
- Play
- Pause
- Skip
- Change Volume
- Queue Playlist

## Requirements
- LavaLink server (You can find public ones here if you wish to not host your own: https://lavalink.darrennathanael.com/)
- MongoDB (Only if you plan to use the bot this way, there is a local database option in the .env file)

## Things to note
- Make sure to rename example.env to .env and fill it out.

- You can use MongoDB by setting the .env variable "DB_TYPE" to "MONGO", or a locally stored DB using nedb-promises by changing "DB_TYPE" to "LOCAL".

- If you just want to play music by commands, you do not need to run /setup, or use a database. This command is only neccesary if you want to use the dedicated music channel feature. Make sure to set the "DB_TYPE" variable in the .env file to "LOCAL" if you plan to use the bot this way.
