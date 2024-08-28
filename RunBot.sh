#!/bin/bash

# Update the Server
steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit

# Run the Bot
node /PalworldBot/index.js