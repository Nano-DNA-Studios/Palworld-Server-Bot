# Palworld Server Bot

Palworld Server Bot is a Typescript project that Bundles a Discord Bot into a Docker Container alongside SteamCMD and a Palworld Dedicated Server App. The Bot will directly control Server Operations, and has a connection with the RESTFUL API the Server Hosts. This allows it to access and get info from the Server along with shutting it down, or restarting it for Maintenance

![image](https://github.com/user-attachments/assets/9e2f5577-3c48-489e-9861-75245434f159)

The bot is capable of numerous command functionalities as shown below:

![image](https://github.com/user-attachments/assets/f34b2d5e-3c6f-42eb-8331-e3330386922d)

# Bot Operation
To use the bot you can start by loading in a previous world or using setup to create an entirely new world, once loaded, you can start the server
<img width="689" height="430" alt="image" src="https://github.com/user-attachments/assets/a831bf74-fe34-41b3-89a2-06252de7d4e8" />





# Commands
## Announce
Announces a Global Message in the server for all Logged in Players to See
<img width="913" height="91" alt="image" src="https://github.com/user-attachments/assets/4488b179-0e6f-4e19-86de-1971ff2c70b3" />

## Backup
Makes an immediate Backup of the world info and save file (Auto backups occur at time intervals) (5 Latest backups kept)
<img width="913" height="91" alt="image" src="https://github.com/user-attachments/assets/4f3c5505-460f-43ca-81a4-67a529e4c238" />

## Change Settings
Changes one of the many ediatble server settings (Requires a restart to apply)
<img width="902" height="580" alt="image" src="https://github.com/user-attachments/assets/879424bc-190b-434a-a8a4-37aef212d53b" />

## Delete Backup
Deletes the latest backup so it can be replaced with a new by uploading a world
<img width="910" height="91" alt="image" src="https://github.com/user-attachments/assets/89afb958-53e4-4f86-ba66-73697e5c667b" />

## Force Stop
Force Stops the server using a Linux SIGKILL command on the server if the REST API is unresponsive for the Shutdown command
<img width="913" height="96" alt="image" src="https://github.com/user-attachments/assets/41f8c02c-2cba-43bf-a2cc-cf516f3d5051" />

## Load Backup
Loads the latest backup to be the world used and loaded to run

## Ping
Pings the Server to detect if it is online / started and can be connected to
<img width="919" height="117" alt="image" src="https://github.com/user-attachments/assets/b827b0f8-0dee-42cc-b7f3-2f0aac62ce20" />

## Players
Returns a list of the current online players and all offline players. Also displays players level since last ping
<img width="923" height="345" alt="image" src="https://github.com/user-attachments/assets/b56d0bbd-b8cc-421b-b650-3b6f9ca2a392" />

## Register Backup
Registers a new device the backup can be SCP copied to if you want a local copy
<img width="910" height="92" alt="image" src="https://github.com/user-attachments/assets/8ea7d0ff-946b-4acf-a575-4479ea179d2e" />

## Restart
Restarts the Server (Shutdown + Restart)
<img width="916" height="94" alt="image" src="https://github.com/user-attachments/assets/f238cbbb-498e-4d44-b3f1-466ef9356cf6" />

## Save
Creates an instant save instance of the Server. (Auto Saves occur based off the settings value)
<img width="915" height="95" alt="image" src="https://github.com/user-attachments/assets/a1759620-805d-40af-ae83-4395ce3e02bf" />

## Server Settings
Returns a `.txt` file with the current server settings
<img width="925" height="780" alt="image" src="https://github.com/user-attachments/assets/4b49ec72-ce8c-4189-9c44-dbe0f4167e5c" />

## Setup
Sets the server info necessary to connect and creates a new Palworld World
<img width="908" height="217" alt="image" src="https://github.com/user-attachments/assets/52b3f823-369d-48e2-b6fc-03ae2f5bb9f5" />

## Shutdown
Sends and Message to the Server for all players to see and Shutsdown the server (Optional Artifcial Delay can be added)
<img width="905" height="262" alt="image" src="https://github.com/user-attachments/assets/3e9dfca5-45c2-45f7-a98e-eebe7eb6a0a6" />

## Start
Starts the Palworld Server making it playable and joinable
<img width="909" height="96" alt="image" src="https://github.com/user-attachments/assets/fc6a536c-4236-40f4-8ef7-622db86e7158" />

## Status
Displays the server status using the name, number of players online, the Server's uptime and the time since last backup
<img width="922" height="301" alt="image" src="https://github.com/user-attachments/assets/55354478-6a35-44b3-b17a-6021caa08eeb" />

## Update
Shutdown the server if necessary, and uses SteamCMD to update the server to the latest version
<img width="915" height="96" alt="image" src="https://github.com/user-attachments/assets/6ea43e5c-b512-4b97-8c74-ee7b201cf794" />

## Upload Backup
Command to upload a backup file or single player world to use for the Server
<img width="908" height="184" alt="image" src="https://github.com/user-attachments/assets/532efdd5-1efc-44af-85dd-bbd7fd63604e" />

# Note from Creator
I have personally used this bot to host a Palworld Server to play with friends in Early 2024 and over 4 months achieved 100+ hours of play time

I will be remaking this project in the near future to better apply what I have learnt since and develop the bot further

# Creator
Developer and Creator : [MrDNAlex](https://github.com/MrDNAlex)
