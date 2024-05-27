# Use an official Ubuntu base image
FROM mrdnalex/steamcmd:latest

# Rebuild to install Palworld Server upon launching?

# Create the Palworld Server Directory
RUN mkdir /home/steam/PalworldServer

# Install Palworld Server App
RUN steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit

# Give Ownership to the Steam User for the Palworld Server Directory
RUN chown -R steam:steam /home/steam/PalworldServer 
RUN chmod -R 755 /home/steam/PalworldServer

# Assign Environment Variables for steamservice.so
ENV LD_LIBRARY_PATH=/home/steam/.steam/sdk64:$LD_LIBRARY_PATH:

# Start the Container and have it use host device IP Network
# docker run -it --network="host" mrdnalex/palworldserverbot


