# Use an official Ubuntu base image
FROM mrdnalex/steamcmd:latest

# Switch to Root User
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

# Switch to the Steam User
USER steam

# Install Palworld Server App
RUN steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit

# Assign Environment Variables for steamservice.so
ENV LD_LIBRARY_PATH=/home/steam/.steam/sdk64:$LD_LIBRARY_PATH:

# Set Work Directory to be Within the Steam User's Home Directory
WORKDIR /home/steam

# Copy the Palworld Bot Files to the Container
COPY ./ /PalworldBot

# Change Workdirectory to the Palworld Bot Directory
WORKDIR /PalworldBot

# Make the Run Bot Script Executable
RUN sudo chmod +x RunBot.sh

CMD ["./RunBot.sh"]

