var named = require('named-regexp').named;
var rcon = require('simple-rcon');
var dns = require('dns');
var dgram = require('dgram');
var s = dgram.createSocket('udp4');
var matches = {};
var admins = ['STEAM_1:0:foobar'];

s.on('message', function(msg, info) {
	var addr = info.address+':'+info.port;
	var text = msg.toString();
	var re = named(/rcon from "(:<user_ip>[\d\.]+?):\d+": command "rcon_password (:<rcon_pass>.*)"/);
	var match = re.exec(text);
	if(match != null) {
		if(matches[addr] !== undefined) {
			delete matches[addr];
		}
		matches[addr] = new Match(addr, match.captures.rcon_pass[0], match.captures.user_ip[0]);
	}
	if (matches[addr] === undefined) {
		return;
	}
	re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" say "[!\.](:<text>.*)"/);
	match = re.exec(text);
	if(match != null) {
		var isadmin = matches[addr].admin(match.captures.steam_id[0]);
		var param = match.captures.text[0].split(' ');
		var cmd = param[0];
		param.shift();
		switch(cmd) {
			case 'stats':
			case 'score':
				matches[addr].stats(true);
				break;
			case 'reset':
			case 'warmup':
				if (isadmin) matches[addr].warmup();
				break;
			case 'map':
			case 'start':
				if (isadmin) matches[addr].start(param);
				break;
			case 'force':
				if (isadmin) matches[addr].ready(true);
				break;
			case 'ready':
			case 'unpause':
				matches[addr].ready(match.captures.user_team[0]);
				break;
			case 'pause':
				matches[addr].pause();
				break;
			case 'stay':
				matches[addr].stay(match.captures.user_team[0]);
				break;
			case 'swap':
			case 'switch':
				matches[addr].swap(match.captures.user_team[0]);
				break;
			case 'knife':
				if (isadmin) matches[addr].knife();
				break;
			case 'disconnect':
			case 'quit':
				if (isadmin) {
					matches[addr].quit();
					delete matches[addr];
					console.log('Disconnected from '+addr);
				}
			default:
		}
	}
	re = named(/Started map "(:<map>.*?)"/);
	match = re.exec(text);
	if(match != null) {
		matches[addr].newmap(match.captures.map[0]);
	}
	re = named(/Team "(:<team>.*)" triggered "SFUI_Notice_(:<team_win>Terrorists_Win|CTs_Win|Target_Bombed|Target_Saved|Bomb_Defused)" \(CT "(:<ct_score>\d+)"\) \(T "(:<t_score>\d+)"\)/);
	match = re.exec(text);
	if(match != null) {
		var score = { 'TERRORIST': parseInt(match.captures.t_score[0]), 'CT': parseInt(match.captures.ct_score[0]) };
		matches[addr].score(score);
	}
});

function Match (address, pass, adminip) {
	var tag = this;
	this.state = {
		ip: address.split(':')[0],
		port: address.split(':')[1] || 27015,
		pass: pass,
		live: false,
		map: '',
		maps: [],
		knife: false,
		score: [],
		knifewinner: false,
		paused: false,
		unpause: { 'TERRORIST': false, 'CT': false },
		ready: { 'TERRORIST': false, 'CT': false },
		steamid: [],
		admins: [],
		queue: []
	};
	this.rcon = function (cmd) {
		this.state.queue.push(cmd);
	}
	this.realrcon = function (cmd) {
		var conn = new rcon( { host: this.state.ip, port: this.state.port, password: this.state.pass } );
		conn.on('authenticated', function () {
			cmd = cmd.split(';');
			for (var i in cmd) {
				conn.exec(cmd[i]);
			}
			conn.close();
		}).on('error', function (err) {
			//console.log(err);
		});
		conn.connect();
	}
	this.admin = function (steamid) {
		if(this.state.steamid.indexOf(steamid) >= 0 || admins.indexOf(steamid) >= 0) {
			return true;
		}
		return false;
	}
	this.stats = function (tochat) {
		var stat = [];
		var chat = [];
		for (var i in this.state.maps) {
			if(this.state.score[this.state.maps[i]] !== undefined) {
				stat.push(this.state.maps[i]+' '+this.state.score[this.state.maps[i]]['TERRORIST']+'-'+this.state.score[this.state.maps[i]]['CT']);
				chat.push('\x10'+this.state.maps[i]+' \x04'+this.state.score[this.state.maps[i]]['TERRORIST']+'-'+this.state.score[this.state.maps[i]]['CT']);
			} else {
				stat.push(this.state.maps[i]+' x-x');
				chat.push('\x10'+this.state.maps[i]+' \x04x-x');
			}
		}
		if(tochat) {
			this.rcon('say '+chat.join('\x10, '));
		} else {
			this.rcon('mp_teammatchstat_txt "'+stat.join(', ')+'"');
		}
	}
	this.pause = function () {
		if (!this.state.live) return;
		this.rcon('mp_pause_match;say \x10Pausing match in next round.');
		this.state.paused = true;
		this.state.unpause = { 'TERRORIST': false, 'CT': false };
	}
	this.status = function () {
		var tag = this;
		var conn = new rcon(
			{ host: this.state.ip, port: this.state.port, password: this.state.pass }
		).on('error', function (err) {
			//console.log(err);
		}).exec('status', function (res) {
			var re = named(/map\s+:\s+(:<map>.*?)\s/);
			var match = re.exec(res.body);
			if(match != null) {
				var map = match.captures.map[0];
				if(tag.state.maps.indexOf(map) >= 0) {
					tag.state.map = map;
				} else {
					tag.state.maps = [map];
					tag.state.map = map;
				}
				tag.stats(false);			
			}
			var regex = new RegExp('"(:<user_name>.*?)" (:<steam_id>STEAM_.*?) .*?'+adminip+':', '');
			re = named(regex);
			match = re.exec(res.body);
			if(match != null) {
				for(var i in match.captures.steam_id) {
					if(tag.state.steamid.indexOf(match.captures.steam_id[i]) == -1) {
						tag.state.steamid.push(match.captures.steam_id[i]);
						tag.state.admins.push(match.captures.user_name[i]);
					}
				}
			}
			tag.rcon('say \x10Hi! I\'m OrangeBot.'+(tag.state.admins.length > 0 ? ' \x0e'+tag.state.admins.join(', ')+'\x10 is now my admin.' : '') + ';say \x10Start a match with \x04!start map \x08map map');
		}).exec('mp_warmup_pausetimer', function (res) {
			var re = named(/= "(:<paused>.*?)"/);
			var match = re.exec(res.body);
			if(match != null) {
				tag.state.live = match.captures.paused[0] == '1' ? false : true;
			}
			conn.close();
		}).connect();
	}
	this.start = function (maps) {
		this.state.score = [];
		if (maps.length > 0) {
			this.state.maps = maps;
			if(this.state.map != maps[0]) {
				this.rcon('changelevel '+this.state.maps[0]);
			} else {
				this.newmap(maps[0]);
			}
		} else {
			this.newmap(this.state.maps[0]);
		}
	}
	this.ready = function (team) {
		if (this.state.live && this.state.paused) {
			if (team === true) {
				this.state.unpause['TERRORIST'] = true;
				this.state.unpause['CT'] = true;
			} else {
				this.state.unpause[team] = true;
			}
			if (this.state.unpause['TERRORIST'] == true && this.state.unpause['CT'] == true) {
				this.rcon('mp_unpause_match');
				this.rcon('say \x10Resuming match!')
				this.state.paused = false;
				this.state.unpause = { 'TERRORIST': false, 'CT': false };
			}	
		} else if (!this.state.live) {
			if (team === true) {
				this.state.ready['TERRORIST'] = true;
				this.state.ready['CT'] = true;
			} else {
				this.state.ready[team] = true;
			}
			if (this.state.ready['TERRORIST'] != this.state.ready['CT']) {
				this.rcon('say \x10' + ( this.state.ready['TERRORIST'] ? 'Terrorists' : 'Counter-Terrorists' ) + ' are \x04!ready\x10, waiting for ' + ( this.state.ready['TERRORIST'] ? 'Counter-Terrorists' : 'Terrorists' ) + '.');
			} else if (this.state.ready['TERRORIST'] == true && this.state.ready['CT'] == true) {
				this.state.live = true;
				var tag = this;
				if(this.state.knife) {
					this.rcon('mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;mp_maxmoney 0;mp_t_default_secondary "";mp_ct_default_secondary "";mp_free_armor 1;mp_give_player_c4 0;say \x10Both teams are \x04!ready\x10, starting knife round in:;say \x085...');
					setTimeout(function(){tag.rcon('say \x10Knife round started! GL HF!');}, 8000);
				} else {
					this.rcon('mp_maxmoney 16000;mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;say \x10Both teams are \x04!ready\x10, starting match in:;say \x085...');
					setTimeout(function(){tag.rcon('say \x10Match started! GL HF!');}, 8000);
				}
				setTimeout(function(){tag.rcon('say \x054...');}, 1000);
				setTimeout(function(){tag.rcon('say \x043...');}, 2000);
				setTimeout(function(){tag.rcon('say \x102...');}, 3000);
				setTimeout(function(){tag.rcon('say \x0f1...');}, 4000);
				setTimeout(function(){tag.rcon('say \x03LIVE!;say \x0eLIVE!;say \x02LIVE!');}, 5000);
			}
		}
	}
	this.newmap = function (map) {
		var index = -1;
		if (this.state.maps.indexOf(map) >= 0) {
			index = this.state.maps.indexOf(map);
			this.state.map = map;
		} else {
			this.state.maps = [map];
			this.state.map = map;
		}
		setTimeout(function () {
			if (index >= 0 && tag.state.maps[index+1] !== undefined) {
				tag.rcon('nextlevel '+tag.state.maps[index+1]);
			} else {
				tag.rcon('nextlevel ""');
			}
			tag.stats(false);
			tag.warmup();
		}, 1000);
	}
	this.knife = function () {
		if(this.state.live) return;
		this.state.knife = true;
		this.rcon('say \x10Knife round will start when both teams are \x04!ready\x10.');
	}
	this.score = function (score) {
		this.state.score[this.state.map] = score;
		this.stats(false);
		if (score['TERRORIST'] + score['CT'] == 1 && this.state.knife) {
			this.state.knifewinner = score['TERRORIST'] == 1 ? 'TERRORIST' : 'CT';
			this.state.knife = false;
			this.rcon('mp_pause_match;mp_maxmoney 16000;mp_t_default_secondary "weapon_glock";mp_ct_default_secondary "weapon_hkp2000";mp_free_armor 0;mp_give_player_c4 1;say \x06' + ( this.state.knifewinner == 'TERRORIST' ? 'Terrorists' : 'Counter-Terrorists' ) + ' \x10won the knife round!;say \x10Do you want to \x04!stay\x10 or \x04!swap\x10?');
		} else if (this.state.paused) {
			this.rcon('say \x10Match will resume when both teams are \x04!ready\x10.')
		}
	}
	this.stay = function (team) {
		if (team == this.state.knifewinner) {
			this.rcon('mp_unpause_match;mp_restartgame 1;say \x10Match started! GL HF!');
			this.state.knifewinner = false;
		}
	}
	this.swap = function (team) {
		if (team == this.state.knifewinner) {
			this.rcon('mp_unpause_match;mp_swapteams;say \x10Match started! GL HF!');
			this.state.knifewinner = false;
		}
	}
	this.quit = function () {
		this.rcon('logaddress_delall;log off');
		this.rcon('say \x10I\'m outta here!');
	}
	this.warmup = function () {
		this.state.ready = { 'TERRORIST': false, 'CT': false };
		this.state.unpause = { 'TERRORIST': false, 'CT': false };
		this.state.live = false;
		this.state.paused = false;
		this.state.knifewinner = false;
		this.state.knife = false;
		this.rcon('game_type 0;game_mode 1;ammo_grenade_limit_default 1;ammo_grenade_limit_flashbang 2;ammo_grenade_limit_total 4;bot_quota 4;cash_player_bomb_defused 300;cash_player_bomb_planted 300;cash_player_damage_hostage -30;cash_player_interact_with_hostage 150;cash_player_killed_enemy_default 300;cash_player_killed_enemy_factor 1;cash_player_killed_hostage -1000;cash_player_killed_teammate -300;cash_player_rescued_hostage 1000;cash_team_elimination_bomb_map 3250;cash_team_hostage_alive 150;cash_team_hostage_interaction 150;cash_team_loser_bonus 1400;cash_team_loser_bonus_consecutive_rounds 500;cash_team_planted_bomb_but_defused 800;cash_team_rescued_hostage 750;cash_team_terrorist_win_bomb 3500;cash_team_win_by_defusing_bomb 3500;cash_team_win_by_hostage_rescue 3500;cash_player_get_killed 0;cash_player_respawn_amount 0;cash_team_elimination_hostage_map_ct 2000;cash_team_elimination_hostage_map_t 1000;cash_team_win_by_time_running_out_bomb 3250;cash_team_win_by_time_running_out_hostage 3250;ff_damage_reduction_grenade 0.85;ff_damage_reduction_bullets 0.33;ff_damage_reduction_other 0.4;ff_damage_reduction_grenade_self 1;mp_afterroundmoney 0;mp_autokick 0;mp_autoteambalance 0;mp_buytime 15;mp_c4timer 35;mp_death_drop_defuser 1;mp_death_drop_grenade 2;mp_death_drop_gun 1;mp_defuser_allocation 0;mp_do_warmup_period 1;mp_forcecamera 1;mp_force_pick_time 160;mp_free_armor 0;mp_freezetime 12;mp_friendlyfire 1;mp_halftime 1;mp_halftime_duration 15;mp_join_grace_time 30;mp_limitteams 0;mp_logdetail 3;mp_match_can_clinch 1;mp_match_end_changelevel 1;mp_match_end_restart 0;mp_match_restart_delay 30;mp_maxmoney 65535;mp_maxrounds 30;mp_molotovusedelay 0;mp_overtime_enable 1;mp_overtime_maxrounds 6;mp_overtime_startmoney 10000;mp_playercashawards 1;mp_playerid 0;mp_playerid_delay 0.5;mp_playerid_hold 0.25;mp_round_restart_delay 5;mp_roundtime 1.75;mp_roundtime_defuse 1.75;mp_solid_teammates 1;mp_startmoney 800;mp_teamcashawards 1;mp_teammatchstat_holdtime 0;mp_teammatchstat_txt "";mp_timelimit 0;mp_tkpunish 0;mp_weapons_allow_map_placed 1;mp_weapons_allow_zeus 1;mp_win_panel_display_time 15;spec_freeze_time 5.0;spec_freeze_panel_extended_time 0;sv_accelerate 5.5;sv_stopspeed 80;sv_allow_votes 0;sv_allow_wait_command 0;sv_alltalk 0;sv_alternateticks 0;sv_cheats 0;sv_clockcorrection_msecs 15;sv_consistency 0;sv_contact 0;sv_damage_print_enable 0;sv_dc_friends_reqd 0;sv_deadtalk 0;sv_forcepreload 0;sv_friction 5.2;sv_full_alltalk 0;sv_gameinstructor_disable 1;sv_ignoregrenaderadio 0;sv_kick_players_with_cooldown 0;sv_kick_ban_duration 0;sv_lan 0;sv_log_onefile 0;sv_logbans 1;sv_logecho 0;sv_logfile 1;sv_logflush 0;sv_logsdir logfiles;sv_maxrate 0;sv_mincmdrate 30;sv_minrate 20000;sv_competitive_minspec 1;sv_competitive_official_5v5 1;sv_pausable 1;sv_pure 1;sv_pure_kick_clients 1;sv_pure_trace 0;sv_spawn_afk_bomb_drop_time 30;sv_steamgroup_exclusive 0;mp_unpause_match;mp_warmuptime 15;mp_warmup_start;mp_warmup_pausetimer 1');
	}
	setInterval(function () {
		if(!tag.state.live) {
			tag.rcon('say \x10Match will start when both teams are \x04!ready\x10.');
		} else if(tag.state.paused) {
			tag.rcon('say \x10Match will resume when both teams are \x04!ready\x10.');
		}
	}, 30000);
	setInterval(function () {
		if(tag.state.queue.length > 0) {
			var cmd = tag.state.queue.shift();
			tag.realrcon(cmd);
		}
	}, 100)
	this.rcon('sv_rcon_whitelist_address 95.85.2.171;logaddress_add 95.85.2.171:1337;log on');
	this.status();
	console.log('Connected to '+this.state.ip+':'+this.state.port+', pass '+this.state.pass);
}
s.bind(1337);
console.log('Listening on 1337');

//matches['1.2.3.4:27015'] = new Match('1.2.3.4:27015', 'ducksauce');
