# OrangeBot
OrangeBot is a CS:GO matchmaking bot written in node.js. It uses a logaddress and rcon to execute server commands based on chat !commands. This means it works on a vanilla CS:GO server.

## Howto
```
npm install
node orangebot.js
```
You can define static servers and admins steamid in orangebot.js or connect your server dynamically with rcon
```
connect your.server;rcon_password your_rcon;rcon logaddress_add orangebot.ip:1337;rcon log on;rcon rcon_password your_rcon
```
The last command is to echo your password to the log so the bot can connect. The bot should now greet and make you an admin. Now you can f.e. start a BO3 match with `!start de_dust2 de_cache de_mirage` in game chat. Both teams have to `!ready` once to start the match. You can specify a `!knife` round before this if you wanna. Players can `!pause` the game on next freezetime if they want to.

| Admin commands         | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !start [map map map …] | Starts a BO1-match in current map or BO[n] match in listed maps. (Aliases: !startmatch, !map, !maps, !match)                      |
| !reset                 | Resets current map to warmup state. Not the whole match. (Aliases: !restart, !warmup)                                                 |
| !knife                 | Sets/cancels current map to start with a knife round.                                                                                 |
| !leave                 | Tells the bot to leave the server alone. (Aliases: !disconnect, !quit)                                                                |
| !force                 | Starts or resumes match bypassing !ready.                                                                                             |

| Player commands        | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !ready                 | Tells the bot your team is ready to start or resume the match. Match is LIVE after both teams are ready. (Aliases: !resume, !unpause) |
| !pause                 | Pauses the match on next freeze time. Match will resume when both teams are !ready.                                                   |
| !swap                  | Swap teams after knife round. Match is LIVE after one restart. (Aliases: !switch)                                                     |
| !stay                  | Stay on this team after knife round. Match is LIVE after one restart.                                                                 |
| !score                 | Check what the score was in previous maps in BO[n] game. (Aliases: !stats, !status, !scores)                                          |
