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
RUN mkdir /home/steam/PalworldBot
RUN mkdir /home/steam/PalworldServer
RUN mkdir /home/steam/Backups

# Give Ownership to the Steam User for the Palworld Server Directory
RUN chown -R steam:steam /home/steam/PalworldServer 
RUN chmod -R 755 /home/steam/PalworldServer

# Give Ownership to the Steam User for the Palworld Bot Directory
RUN chown -R steam:steam /home/steam/PalworldBot
RUN chmod -R 755 /home/steam/PalworldBot

# Give Ownership to the Steam User for the Backup Directory
RUN chown -R steam:steam /home/steam/Backups
RUN chmod -R 755 /home/steam/Backups

USER steam

# Install Palworld Server App
RUN steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit

# Assign Environment Variables for steamservice.so
ENV LD_LIBRARY_PATH=/home/steam/.steam/sdk64:$LD_LIBRARY_PATH:

WORKDIR /home/steam

COPY ./ /home/steam/PalworldBot

# Start the Container and have it use host device IP Network
# docker run -it --network="host" mrdnalex/palworldserverbot

WORKDIR /home/steam/PalworldBot

CMD ["node", "/home/steam/PalworldBot/index.js"]

