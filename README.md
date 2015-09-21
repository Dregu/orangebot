# orangebot
OrangeBot is a CS:GO matchmaking bot written in node.js. It uses a logaddress and rcon to execute server commands based on chat !commands. This means it works on a vanilla CS:GO server.

## Howto
You can define static servers and admins steamid in orangebot.js or connect your server dynamically with rcon
```
connect your.server;rcon_password your_rcon;rcon logaddress_add orangebot.ip:1337;rcon log on;rcon rcon_password your_rcon
```
The last command is to echo your password to the log so the bot can connect. The bot should now greet and make you an admin. Now you can f.e. start a BO3 match with `!start de_dust2 de_cache de_mirage` in game chat. Both teams have to `!ready` once to start the match. You can specify a `!knife` round before this if you wanna. Players can `!pause` the game on next freezetime if they want to.
