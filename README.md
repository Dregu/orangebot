# orangebot
OrangeBot is a CS:GO matchmaking bot written in node.js. It uses a logaddress and rcon to execute server commands based on chat !commands. This means it works on a vanilla CS:GO server.

## Howto
You can define static servers in the source
```javascript
matches['1.2.3.4:27015'] = new Match('1.2.3.4:27015', 'ducksauce');
```
or connect your server dynamically with rcon
```
rcon logaddress_add orangebot.ip:1337;rcon log on;rcon rcon_password ducksauce
```