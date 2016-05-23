# OrangeBot
OrangeBot is a CS:GO matchmaking bot written in node.js. It uses a logaddress and rcon to execute server commands based on chat !commands. This means it works on a vanilla CS:GO server.

## Howto
```
npm install
node orangebot.js
```
You can start a BO3 match with `!start de_dust2 de_cache de_mirage` in game chat. Both teams have to `!ready` once to start the match. A knife round will start before each map. Players can `!pause` the game on next freezetime if they want to.

| config.json settings   | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| port                   | Set the local port of the orangebot to listen on.                                                                                     |
| server[]               | Configure all servers that the bot will automatically connect to. Every server needs `host`, `port` and `pass`.                       |
| admins[]               | Contains the Steam-IDs of every player that is supposed to be an administrator.                                                       |
| default_rcon           | If you want to add servers that are not configured in `server[]` this rcon password will be used.                                     |
| telegram_token         | You can configure a Telegram - Bot to keep you updated about the game. This is the token for it.                                      |
| telegram_group         | If you set `telegram_token` you need to specify a groupID where the Bot will write the status updates into.                           |
| pause_time             | Limit the maximum duration for a pause in seconds. Set to 0 to not set any time limit.                                                |
| pause_uses             | Limit how often teams can call a pause per map. Set to 0 to not set any limit.                                                        |
| ready_time             | Limit the time both teams have to be ready for match start. Set to 0 to not set any limit.                                            |
| serverType             | If your node.js server is running on the same machine as the CS:GO server use `local`, if not use `external`.                         |

| Admin commands         | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !reset                 | Resets current map to warmup state. Not the whole match. (Aliases: !restart, !warmup)                                                 |
| !leave                 | Tells the bot to leave the server. (Aliases: !disconnect, !quit)                                                                      |
| !force                 | Starts or resumes match bypassing !ready.                                                                                             |
| !restore [round]       | Restarts the match at a given round by using automatic backup files. (Aliases: !replay)                                               |

| Player commands        | Function                                                                                                                              |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| !start [map map map …] | Starts a BO1-match in current map or BO[n] match in listed maps. (Aliases: !startmatch, !map, !maps, !match)                          |
| !knife                 | Sets/cancels current map to start with a knife round.                                                                                 |
| !ready                 | Tells the bot your team is ready to start or resume the match. Match is LIVE after both teams are ready. (Aliases: !resume, !unpause) |
| !pause                 | Pauses the match on next freeze time. Match will resume when both teams are !ready.                                                   |
| !swap                  | Swap teams after knife round. Match is LIVE after one restart. (Aliases: !switch)                                                     |
| !stay                  | Stay on this team after knife round. Match is LIVE after one restart.                                                                 |
| !score                 | Check what the score was in previous maps in BO[n] game. (Aliases: !stats, !status, !scores)                                          |
