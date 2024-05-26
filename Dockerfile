# Use an official Ubuntu base image
FROM ubuntu:20.04

# Set environment variables to non-interactive (this prevents some prompts)
ENV DEBIAN_FRONTEND=noninteractive

# Install packages and dependencies for steamcmd
RUN apt-get update && apt-get install -y \
    sudo \
    expect \
    lib32gcc-s1 \
    lib32stdc++6 \
    lib32z1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download and install steamcmd
# RUN mkdir -p /SteamCMD && \
#     cd /SteamCMD && \
#     curl -s http://media.steampowered.com/installer/steamcmd_linux.tar.gz | tar -vxz && \
#     ./steamcmd.sh +quit && \
#     chmod +x /SteamCMD/steamcmd.sh

RUN sudo add-apt-repository multiverse; sudo dpkg --add-architecture i386; sudo apt update

RUN echo steamcmd steam/question select "I AGREE" | sudo debconf-set-selections && \
    echo steamcmd steam/license note '' | sudo debconf-set-selections && \
    sudo apt-get install -y steamcmd

ENV PATH=$PATH:/usr/games


# RUN apt-get update && \
#     apt-get install -y software-properties-common && \
#     add-apt-repository multiverse && \
#     dpkg --add-architecture i386 && \
#     apt-get update

# RUN expect -c "\
#     spawn apt-get install -y steamcmd; \
#     expect \"[More]\" { send \"\n\\r\" }; \
#     expect \"Do you agree to all terms of the Steam License Agreement?\" { send \"2\\r\" }; \
#     interact"



# Setup the working Awork directory
WORKDIR /home

# Optional: Expose ports if necessary
# EXPOSE <port>

# Optional: Set the default command
# CMD ["./steamcmd.sh"]


