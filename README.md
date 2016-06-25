# OrangeBot
OrangeBot is a CS:GO matchmaking bot written in node.js. It uses a logaddress and rcon to execute server commands based on chat !commands. This means it works on a vanilla CS:GO server.

## Howto
```
npm install
sudo npm install -g forever
cp default-config.json config.json
nano config.json
forever start orangebot.js
```
You can define static servers and admins steamid in config.json or connect your server dynamically with rcon.
Current master branch contains our league specific features like irc announcements and telegram bot for admins.

| Player commands        | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !start [map map map …] | Starts a BO1-match with map veto or BO[n] match in listed maps. Works only in warmup state. (Aliases: !startmatch, !map, !maps, !match)                           |
| !ban                   | Bans a map from the map pool after !start. |
| !ready                 | Tells the bot your team is ready to start or resume the match. Match is LIVE after both teams are ready. (Aliases: !resume, !unpause) |
| !pause                 | Pauses the match on next freeze time. Match will resume when both teams are !ready.                                                   |
| !swap                  | Swap teams after knife round. Match is LIVE after one restart. (Aliases: !switch)                                                     |
| !stay                  | Stay on this team after knife round. Match is LIVE after one restart.                                                                 |
| !admin                 | 
| !score                 | Check what the score was in previous maps in BO[n] game. (Aliases: !stats, !status, !scores)                                          |

| Admin commands         | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !start [map map map …] | Admins can override live matches. (Aliases: !startmatch, !map, !maps, !match)                           |
| !reset                 | Resets current map to warmup state. Not the whole match. (Aliases: !restart, !warmup)                                                 |
| !knife                 | Sets/cancels current map to start with a knife round.                                                                                 |
| !leave                 | Tells the bot to leave the server alone. (Aliases: !disconnect, !quit)                                                                |
| !force                 | Starts or resumes match bypassing !ready.                                                                                             |
