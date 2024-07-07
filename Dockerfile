# Use an official Ubuntu base image
FROM mrdnalex/steamcmd:latest

# Rebuild to install Palworld Server upon launching?

USER root

# Set the Node.js version
ENV NODE_VERSION=20.11.1

# Download and install Node.js
RUN cd /tmp \
    && curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
    && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v$NODE_VERSION-linux-x64.tar.xz

# Create the Palworld Server Directory
RUN mkdir /PalworldBot
RUN mkdir /home/steam/PalworldServer
RUN mkdir /home/steam/Backups
RUN mkdir /home/steam/Backups/Extras

# Give Ownership to the Steam User for the Palworld Server Directory
RUN chown -R steam:steam /home/steam/PalworldServer 
RUN chmod -R 755 /home/steam/PalworldServer

# Give Ownership to the Steam User for the Palworld Bot Directory
RUN chown -R steam:steam /PalworldBot
RUN chmod -R 755 /PalworldBot

# Give Ownership to the Steam User for the Backup Directory
RUN chown -R steam:steam /home/steam/Backups
RUN chmod -R 755 /home/steam/Backups

USER steam

# Install Palworld Server App
RUN steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit

# Assign Environment Variables for steamservice.so
ENV LD_LIBRARY_PATH=/home/steam/.steam/sdk64:$LD_LIBRARY_PATH:

WORKDIR /home/steam

COPY ./ /PalworldBot

# Start the Container and have it use host device IP Network
# docker run -it --network="host" -v "/home/mrdna/Projects/PalworldServer/Backups":"/home/steam/Backups" -v "/home/mrdna/Projects/PalwordServer/Settings":"/home/steam/PalworldBot/Resources"  mrdnalex/palworldserverbot

WORKDIR /PalworldBot

CMD ["node", "/PalworldBot/index.js"]

