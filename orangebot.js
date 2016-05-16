///////////////////////////////////////////////////////////////////////////////

var myip = require('ip').address();
var myport = '1337';
var admins = ['STEAM_1:0:4534656']; // Global admins ho here
var static = [
	// Static servers go here
	// { host: 'foobar.fi', port: 27015, pass: 'pass' },
	// { host: 'kekbur.fi', port: 27015, pass: 'pass' }
];

///////////////////////////////////////////////////////////////////////////////

var WARMUP = 'say \x10Match will start when both teams are \x06!ready\x10.',
	WARMUP_KNIFE = 'say \x10Knife round will start when both teams are \x06!ready\x10.',
	KNIFE_DISABLED = 'say \x10Cancelled knife round.',
	KNIFE_STARTING = 'mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;mp_maxmoney 0;mp_t_default_secondary "";mp_ct_default_secondary "";mp_free_armor 1;mp_give_player_c4 0;tv_record {0};say \x10Both teams are \x06!ready\x10, starting knife round in:;say \x085...',
	KNIFE_STARTED = 'say \x10Knife round started! GL HF!',
	KNIFE_WON = 'mp_pause_match;mp_maxmoney 16000;mp_t_default_secondary "weapon_glock";mp_ct_default_secondary "weapon_hkp2000";mp_free_armor 0;mp_give_player_c4 1;say \x06{0} \x10won the knife round!;say \x10Do you want to \x06!stay\x10 or \x06!swap\x10?',
	KNIFE_STAY = 'mp_unpause_match;mp_restartgame 1;say \x10Match started! GL HF!',
	KNIFE_SWAP = 'mp_unpause_match;mp_swapteams;say \x10Match started! GL HF!',
	PAUSE_ENABLED = 'mp_pause_match;say \x10Pausing match on freeze time!',
	MATCH_STARTING = 'mp_maxmoney 16000;mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;tv_record {0};say \x10Both teams are \x06!ready\x10, starting match in:;say \x085...',
	MATCH_STARTED = 'say \x10Match started! GL HF!',
	MATCH_PAUSED = 'mp_respawn_on_death_t 1;mp_respawn_on_death_ct 1;say \x10Match will resume when both teams are \x06!ready\x10.',
	MATCH_UNPAUSE = 'mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0;mp_unpause_match;say \x10Both teams are \x06!ready\x10, resuming match!',
	ROUND_STARTED = 'mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0',
	READY = 'say \x10{0} are \x06!ready\x10, waiting for {1}.',
	LIVE = 'say \x03LIVE!;say \x0eLIVE!;say \x02LIVE!',
	T = 'Terrorists',
	CT = 'Counter-Terrorists',
	CONFIG = 'exec esl5on5;sv_steamgroup_exclusive 0;mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0;mp_unpause_match;mp_warmuptime 15;mp_warmup_start;mp_warmup_pausetimer 1;say \x10Match will start when both teams are \x06!ready\x10.';
	//CONFIG = 'game_type 0;game_mode 1;ammo_grenade_limit_default 1;ammo_grenade_limit_flashbang 2;ammo_grenade_limit_total 4;bot_quota 0;cash_player_bomb_defused 300;cash_player_bomb_planted 300;cash_player_damage_hostage -30;cash_player_interact_with_hostage 150;cash_player_killed_enemy_default 300;cash_player_killed_enemy_factor 1;cash_player_killed_hostage -1000;cash_player_killed_teammate -300;cash_player_rescued_hostage 1000;cash_team_elimination_bomb_map 3250;cash_team_hostage_alive 150;cash_team_hostage_interaction 150;cash_team_loser_bonus 1400;cash_team_loser_bonus_consecutive_rounds 500;cash_team_planted_bomb_but_defused 800;cash_team_rescued_hostage 750;cash_team_terrorist_win_bomb 3500;cash_team_win_by_defusing_bomb 3500;cash_team_win_by_hostage_rescue 3500;cash_player_get_killed 0;cash_player_respawn_amount 0;cash_team_elimination_hostage_map_ct 2000;cash_team_elimination_hostage_map_t 1000;cash_team_win_by_time_running_out_bomb 3250;cash_team_win_by_time_running_out_hostage 3250;ff_damage_reduction_grenade 0.85;ff_damage_reduction_bullets 0.33;ff_damage_reduction_other 0.4;ff_damage_reduction_grenade_self 1;mp_afterroundmoney 0;mp_autokick 0;mp_autoteambalance 0;mp_buytime 15;mp_c4timer 35;mp_death_drop_defuser 1;mp_death_drop_grenade 2;mp_death_drop_gun 1;mp_defuser_allocation 0;mp_do_warmup_period 1;mp_forcecamera 1;mp_force_pick_time 160;mp_free_armor 0;mp_freezetime 15;mp_friendlyfire 1;mp_halftime 1;mp_halftime_duration 15;mp_join_grace_time 30;mp_limitteams 0;mp_logdetail 3;mp_match_can_clinch 1;mp_match_end_changelevel 1;mp_match_end_restart 0;mp_match_restart_delay 120;mp_maxmoney 65535;mp_maxrounds 30;mp_molotovusedelay 0;mp_overtime_enable 1;mp_overtime_maxrounds 6;mp_overtime_startmoney 10000;mp_playercashawards 1;mp_playerid 0;mp_playerid_delay 0.5;mp_playerid_hold 0.25;mp_round_restart_delay 5;mp_roundtime 1.75;mp_roundtime_defuse 1.75;mp_solid_teammates 1;mp_startmoney 800;mp_teamcashawards 1;mp_teammatchstat_holdtime 0;mp_teammatchstat_txt "";mp_timelimit 0;mp_tkpunish 0;mp_weapons_allow_map_placed 1;mp_weapons_allow_zeus 1;mp_win_panel_display_time 1;spec_freeze_time 5.0;spec_freeze_panel_extended_time 0;sv_accelerate 5.5;sv_stopspeed 80;sv_allow_votes 0;sv_allow_wait_command 0;sv_alltalk 0;sv_alternateticks 0;sv_cheats 0;sv_clockcorrection_msecs 15;sv_consistency 0;sv_contact 0;sv_damage_print_enable 0;sv_dc_friends_reqd 0;sv_deadtalk 0;sv_forcepreload 0;sv_friction 5.2;sv_full_alltalk 0;sv_gameinstructor_disable 1;sv_ignoregrenaderadio 0;sv_kick_players_with_cooldown 0;sv_kick_ban_duration 0;sv_lan 0;sv_log_onefile 0;sv_logbans 1;sv_logecho 0;sv_logfile 1;sv_logflush 0;sv_logsdir logfiles;sv_maxrate 0;sv_mincmdrate 30;sv_minrate 20000;sv_competitive_minspec 1;sv_competitive_official_5v5 1;sv_pausable 1;sv_pure 1;sv_pure_kick_clients 1;sv_pure_trace 0;sv_spawn_afk_bomb_drop_time 30;sv_steamgroup_exclusive 0;mp_respawn_on_death_t 0;mp_respawn_on_death_ct 0;mp_unpause_match;mp_warmuptime 15;mp_warmup_start;mp_warmup_pausetimer 1;say \x10Match will start when both teams are \x06!ready\x10.';

///////////////////////////////////////////////////////////////////////////////

var named = require('named-regexp').named;
var rcon = require('simple-rcon');
var dns = require('dns');
var dgram = require('dgram');
var s = dgram.createSocket('udp4');
var SteamID = require('steamid');
var admins64 = [];

function id64(steamid) {
	return (new SteamID(steamid)).getSteamID64();
}

for(var i in admins) {
	admins64.push(id64(admins[i]));
}

String.prototype.format = function () {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{' + i + '\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i]);
	}
	return formatted;
};

s.on('message', function (msg, info) {
	var addr = info.address + ':' + info.port;
	var text = msg.toString();

	// rcon rcon_password
	var re = named(/rcon from "(:<user_ip>[\d\.]+?):\d+": command "rcon_password (:<rcon_pass>.*)"/);
	var match = re.exec(text);
	if (match !== null) {
		if (servers[addr] !== undefined) {
			delete servers[addr];
		}
		servers[addr] = new Server(addr, match.capture('rcon_pass'), match.capture('user_ip'));
	}
	if (servers[addr] === undefined) {
		return;
	}

	// join team
	re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>]" switched from team [<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>] to [<](:<new_team>CT|TERRORIST|Unassigned|Spectator)[>]/);
	match = re.exec(text);
	if (match !== null) {
		if (servers[addr].state.players[match.capture('steam_id')] === undefined) {
			if (match.capture('steam_id') != 'BOT') {
				servers[addr].state.players[match.capture('steam_id')] = new Player(match.capture('steam_id'), match.capture('new_team'), match.capture('user_name'), undefined);
			}
		} else {
			servers[addr].state.players[match.capture('steam_id')].steamid = match.capture('steam_id');
			servers[addr].state.players[match.capture('steam_id')].team = match.capture('new_team');
			servers[addr].state.players[match.capture('steam_id')].name = match.capture('user_name');
		}
	}

	// clantag
	re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*?)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" triggered "clantag" \(value "(:<clan_tag>.*)"\)/);
	match = re.exec(text);
	if (match !== null) {
		if (servers[addr].state.players[match.capture('steam_id')] === undefined) {
			if (match.capture('steam_id') != 'BOT') {
				servers[addr].state.players[match.capture('steam_id')] = new Player(match.capture('steam_id'), match.capture('user_team'), match.capture('user_name'), match.capture('clan_tag'));
			}
		} else {
			servers[addr].state.players[match.capture('steam_id')].clantag = match.capture('clan_tag') !== '' ? match.capture('clan_tag') : undefined;
		}
	}

	// disconnect
	re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" disconnected/);
	match = re.exec(text);
	if (match !== null) {
		if (servers[addr].state.players[match.capture('steam_id')] !== undefined) {
			delete servers[addr].state.players[match.capture('steam_id')];
		}
	}

	// map loading
	re = named(/Loading map "(:<map>.*?)"/);
	match = re.exec(text);
	if (match !== null) {
		for (var prop in servers[addr].state.playerrs) {
			if (servers[addr].state.players.hasOwnProperty(prop)) {
				delete servers[addr].state.players[prop];
			}
		}
	}

	// map started
	re = named(/Started map "(:<map>.*?)"/);
	match = re.exec(text);
	if (match !== null) {
		servers[addr].newmap(match.capture('map'));
	}

	// round start
	re = named(/World triggered "Round_Start"/);
	match = re.exec(text);
	if (match !== null) {
		servers[addr].round();
	}

	// round end
	re = named(/Team "(:<team>.*)" triggered "SFUI_Notice_(:<team_win>Terrorists_Win|CTs_Win|Target_Bombed|Target_Saved|Bomb_Defused)" \(CT "(:<ct_score>\d+)"\) \(T "(:<t_score>\d+)"\)/);
	match = re.exec(text);
	if (match !== null) {
		var score = {
			'TERRORIST': parseInt(match.capture('t_score')),
			'CT': parseInt(match.capture('ct_score'))
		};
		servers[addr].score(score);
	}

	// !command
	re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" say(:<say_team>_team)? "[!\.](:<text>.*)"/);
	match = re.exec(text);
	if (match !== null) {
		var isadmin = servers[addr].admin(match.capture('steam_id'));
		var param = match.capture('text').split(' ');
		var cmd = param[0];
		param.shift();
		switch (cmd) {
		case 'status':
		case 'stats':
		case 'score':
		case 'scores':
			servers[addr].stats(true);
			break;
		case 'restart':
		case 'reset':
		case 'warmup':
			if (isadmin) servers[addr].warmup();
			break;
		case 'maps':
		case 'map':
		case 'start':
		case 'match':
		case 'startmatch':
			if (isadmin) servers[addr].start(param);
			break;
		case 'force':
			if (isadmin) servers[addr].ready(true);
			break;
		case 'resume':
		case 'ready':
		case 'rdy':
		case 'unpause':
			servers[addr].ready(match.capture('user_team'));
			break;
		case 'pause':
			servers[addr].pause();
			break;
		case 'stay':
			servers[addr].stay(match.capture('user_team'));
			break;
		case 'swap':
		case 'switch':
			servers[addr].swap(match.capture('user_team'));
			break;
		case 'knife':
			if (isadmin) servers[addr].knife();
			break;
		case 'disconnect':
		case 'quit':
		case 'leave':
			if (isadmin) {
				servers[addr].quit();
				delete servers[addr];
				console.log('Disconnected from ' + addr);
			}
			break;
		case 'say':
			if (isadmin) servers[addr].say(param.join(' '));
			break;
		case 'debug':
			if (isadmin) servers[addr].debug();
			break;
		default:
		}
	}
});

function clean(str) {
	return str.replace(/[^A-Za-z0-9: \.\-_,]/g, '');
}

function Player(steamid, team, name, clantag) {
	this.steamid = steamid;
	this.team = team;
	this.name = name;
	this.clantag = clantag;
}

function Server(address, pass, adminip) {
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
		freeze: false,
		unpause: {
			'TERRORIST': false,
			'CT': false
		},
		ready: {
			'TERRORIST': false,
			'CT': false
		},
		steamid: [],
		admins: [],
		queue: [],
		players: {}
	};
	this.rcon = function (cmd) {
		if(cmd === undefined) return;
		this.state.queue.push(cmd);
	};
	this.realrcon = function (cmd) {
		if(cmd === undefined) return;
		var conn = new rcon({
			host: this.state.ip,
			port: this.state.port,
			password: this.state.pass
		});
		conn.on('authenticated', function () {
			cmd = cmd.split(';');
			for (var i in cmd) {
				conn.exec(cmd[i]);
			}
			conn.close();
		}).on('error', function (err) {
			console.log(err);
		});
		conn.connect();
	};
	this.clantag = function (team) {
		if (team != 'TERRORIST' && team != 'CT') {
			return team;
		}
		var tags = {};
		var ret = 'plebs';
		if (team == 'CT' && this.clantag('TERRORIST') == 'plebs') {
			ret = 'noobs';
		}
		for (var i in this.state.players) {
			if (this.state.players[i].team == team && this.state.players[i].clantag !== undefined) {
				if (tags[this.state.players[i].clantag] === undefined) {
					tags[this.state.players[i].clantag] = 0;
				}
				tags[this.state.players[i].clantag]++;
			}
		}
		var max = 0;
		for (var prop in tags) {
			if (tags.hasOwnProperty(prop) && tags[prop] > max) {
				ret = prop;
			}
		}
		ret = clean(ret);
		if (team == 'CT' && this.clantag('TERRORIST') == ret) {
			ret = ret + '2';
		}
		return ret;
	};
	this.admin = function (steamid) {
		if (this.state.steamid.indexOf(id64(steamid)) >= 0 || admins64.indexOf(id64(steamid)) >= 0) {
			return true;
		}
		return false;
	};
	this.stats = function (tochat) {
		var team1 = this.clantag('TERRORIST');
		var team2 = this.clantag('CT');
		var stat = {};
		stat[team1] = [];
		stat[team2] = [];
		for (var i in this.state.maps) {
			if (this.state.score[this.state.maps[i]] !== undefined) {
				if (this.state.score[this.state.maps[i]][team1] !== undefined) {
					stat[team1][i] = this.state.score[this.state.maps[i]][team1];
				} else {
					stat[team1][i] = 'x';
				}
				if (this.state.score[this.state.maps[i]][team2] !== undefined) {
					stat[team2][i] = this.state.score[this.state.maps[i]][team2];
				} else {
					stat[team2][i] = 'x';
				}
			} else {
				stat[team1][i] = 'x';
				stat[team2][i] = 'x';
			}
		}
		var maps = [];
		var scores = [];
		for (var j = 0; j < this.state.maps.length; j++) {
			maps.push(this.state.maps[j] + ' ' + stat[team1][j] + '-' + stat[team2][j]);
			scores.push(stat[team1][j] + '-' + stat[team2][j]);
		}
		var out = team1 + ' [' + scores.join(', ') + '] ' + team2;
		var chat = '\x10' + team1 + ' [\x06' + maps.join(', ') + '\x10] ' + team2;
		if (tochat) {
			this.rcon('say ' + chat);
		} else {
			this.rcon('mp_teammatchstat_txt "' + out + '"');
		}
	};
	this.round = function () {
		this.state.freeze = false;
		this.state.paused = false;
		this.rcon(ROUND_STARTED);
	};
	this.pause = function () {
		if (!this.state.live) return;
		this.rcon(PAUSE_ENABLED);
		this.state.paused = true;
		this.state.unpause = {
			'TERRORIST': false,
			'CT': false
		};
		if(this.state.freeze) {
			this.rcon(MATCH_PAUSED);
		}
	};
	this.status = function () {
		var conn = new rcon({
			host: this.state.ip,
			port: this.state.port,
			password: this.state.pass
		}).on('error', function (err) {
			//console.log(err);
		}).exec('status', function (res) {
			var re = named(/map\s+:\s+(:<map>.*?)\s/);
			var match = re.exec(res.body);
			if (match !== null) {
				var map = match.capture('map');
				if (tag.state.maps.indexOf(map) >= 0) {
					tag.state.map = map;
				} else {
					tag.state.maps = [map];
					tag.state.map = map;
				}
				tag.stats(false);
			}
			var regex = new RegExp('"(:<user_name>.*?)" (:<steam_id>STEAM_.*?) .*?' + adminip + ':', '');
			re = named(regex);
			match = re.exec(res.body);
			if (match !== null) {
				for (var i in match.captures.steam_id) {
					if (tag.state.steamid.indexOf(id64(match.captures.steam_id[i])) == -1) {
						tag.state.steamid.push(id64(match.captures.steam_id[i]));
						tag.state.admins.push(match.captures.user_name[i]);
					}
				}
			}
		}).exec('mp_warmup_pausetimer', function (res) {
			var re = named(/= "(:<paused>.*?)"/);
			var match = re.exec(res.body);
			if (match !== null) {
				tag.state.live = match.capture('paused') == '1' ? false : true;
			}
			conn.close();
		}).connect();
	};
	this.start = function (maps) {
		this.state.score = [];
		if (maps.length > 0) {
			this.state.maps = maps;
			if (this.state.map != maps[0]) {
				this.rcon('changelevel ' + this.state.maps[0]);
			} else {
				this.newmap(maps[0], 0);
			}
		} else {
			this.state.maps = [];
			this.newmap(this.state.map, 0);
			setTimeout(function () {
				tag.status();
			}, 1000);
		}
	};
	this.ready = function (team) {
		if (this.state.live && this.state.paused) {
			if (team === true) {
				this.state.unpause.TERRORIST = true;
				this.state.unpause.CT = true;
			} else {
				this.state.unpause[team] = true;
			}
			if (this.state.unpause.TERRORIST != this.state.unpause.CT) {
				this.rcon(READY.format(this.state.ready.TERRORIST ? T : CT, this.state.ready.TERRORIST ? CT : T));
			} else if (this.state.unpause.TERRORIST === true && this.state.unpause.CT === true) {
				this.rcon(MATCH_UNPAUSE);
				this.state.paused = false;
				this.state.unpause = {
					'TERRORIST': false,
					'CT': false
				};
			}
		} else if (!this.state.live) {
			if (team === true) {
				this.state.ready.TERRORIST = true;
				this.state.ready.CT = true;
			} else {
				this.state.ready[team] = true;
			}
			if (this.state.ready.TERRORIST != this.state.ready.CT) {
				this.rcon(READY.format(this.state.ready.TERRORIST ? T : CT, this.state.ready.TERRORIST ? CT : T));
			} else if (this.state.ready.TERRORIST === true && this.state.ready.CT === true) {
				this.state.live = true;
				var demo = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '') + '_' + this.state.map + '_' + clean(this.clantag('TERRORIST')) + '-' + clean(this.clantag('CT')) + '.dem';
				if (this.state.knife) {
					this.rcon(KNIFE_STARTING.format(demo));
					setTimeout(function () {
						tag.rcon(KNIFE_STARTED);
					}, 9000);
				} else {
					this.rcon(MATCH_STARTING.format(demo));
					setTimeout(function () {
						tag.rcon(MATCH_STARTED);
					}, 9000);
				}
				setTimeout(function () {
					tag.rcon('say \x054...');
				}, 1000);
				setTimeout(function () {
					tag.rcon('say \x063...');
				}, 2000);
				setTimeout(function () {
					tag.rcon('say \x102...');
				}, 3000);
				setTimeout(function () {
					tag.rcon('say \x0f1...');
				}, 4000);
				setTimeout(function () {
					tag.rcon(LIVE);
				}, 5000);
			}
		}
	};
	this.newmap = function (map, delay) {
		if (delay === undefined) delay = 10000;
		var index = -1;
		if (this.state.maps.indexOf(map) >= 0) {
			index = this.state.maps.indexOf(map);
			this.state.map = map;
		} else {
			this.state.maps = [map];
			this.state.map = map;
		}
		setTimeout(function () {
			if (index >= 0 && tag.state.maps[index + 1] !== undefined) {
				tag.rcon('nextlevel ' + tag.state.maps[index + 1]);
			} else {
				tag.rcon('nextlevel ""');
			}
			tag.stats(false);
			tag.warmup();
		}, delay);
	};
	this.knife = function () {
		if (this.state.live) return;
		if (!this.state.knife) {
			this.state.knife = true;
			this.rcon(WARMUP_KNIFE);
		} else {
			this.state.knife = false;
			this.rcon(KNIFE_DISABLED);
		}
	};
	this.score = function (score) {
		var tagscore = {};
		tagscore[this.clantag('CT')] = score.CT;
		tagscore[this.clantag('TERRORIST')] = score.TERRORIST;
		this.state.score[this.state.map] = tagscore;
		this.stats(false);
		if (score.TERRORIST + score.CT == 1 && this.state.knife) {
			this.state.knifewinner = score.TERRORIST == 1 ? 'TERRORIST' : 'CT';
			this.state.knife = false;
			this.rcon(KNIFE_WON.format(this.state.knifewinner == 'TERRORIST' ? T : CT));
		} else if (this.state.paused) {
			this.rcon(MATCH_PAUSED);
		}
		this.state.freeze = true;
	};
	this.stay = function (team) {
		if (team == this.state.knifewinner) {
			this.rcon(KNIFE_STAY);
			this.state.knifewinner = false;
		}
	};
	this.swap = function (team) {
		if (team == this.state.knifewinner) {
			this.rcon(KNIFE_SWAP);
			this.state.knifewinner = false;
		}
	};
	this.quit = function () {
		this.rcon('logaddress_delall;log off;say \x10I\'m outta here!');
	};
	this.debug = function () {
		this.rcon('say \x10live: ' + this.state.live + ' paused: ' + this.state.paused + ' freeze: ' + this.state.freeze + ' knife: ' + this.state.knife + ' knifewinner: ' + this.state.knifewinner + ' ready: T:' + this.state.ready.TERRORIST + ' CT:' + this.state.ready.CT + ' unpause: T:' + this.state.unpause.TERRORIST + ' CT:' + this.state.unpause.CT);
		this.stats(true);
	};
	this.say = function (msg) {
		this.rcon('say \x10' + clean(msg));
	};
	this.warmup = function () {
		this.state.ready = {
			'TERRORIST': false,
			'CT': false
		};
		this.state.unpause = {
			'TERRORIST': false,
			'CT': false
		};
		this.state.live = false;
		this.state.paused = false;
		this.state.freeze = false;
		this.state.knifewinner = false;
		this.state.knife = false;
		this.rcon(CONFIG);
	};
	this.rcon('sv_rcon_whitelist_address ' + myip + ';logaddress_add ' + myip + ':' + myport + ';log on');
	this.status();
	setTimeout(function () {
		tag.rcon('say \x10Hi! I\'m OrangeBot.' + (tag.state.admins.length > 0 ? ' \x0e' + tag.state.admins.join(', ') + '\x10 is now my admin.' : '') + ';say \x10Start a match with \x06!start map \x08map map');
	}, 1000);
	console.log('Connected to ' + this.state.ip + ':' + this.state.port + ', pass ' + this.state.pass);
}
setInterval(function () {
	for (var i in servers) {
		if (!servers[i].state.live) {
			if (servers[i].state.knife) {
				servers[i].rcon(WARMUP_KNIFE);
			} else {
				servers[i].rcon(WARMUP);
			}
		} else if (servers[i].state.paused && servers[i].state.freeze) {
			servers[i].rcon(MATCH_PAUSED);
		}
	}
}, 30000);
setInterval(function () {
	for (var i in servers) {
		if (servers[i].state.queue.length > 0) {
			var cmd = servers[i].state.queue.shift();
			servers[i].realrcon(cmd);
		}
	}
}, 100);
s.bind(myport);
process.on('uncaughtException', function (err) {
	console.log(err);
});

function addServer(host, port, pass) {
	dns.lookup(host, 4, function (err, ip) {
		servers[ip + ':' + port] = new Server(ip + ':' + port, pass);
	});
}
var servers = {};
for (var i in static) {
	addServer(static[i].host, static[i].port, static[i].pass);
}
console.log('OrangeBot listening on ' + myport);
console.log('Run this in CS console to connect or configure orangebot.js:');
console.log('connect YOUR_SERVER;password YOUR_PASS;rcon_password YOUR_RCON;rcon sv_rcon_whitelist_address ' + myip + ';rcon logaddress_add ' + myip + ':' + myport + ';rcon log on;rcon rcon_password YOUR_RCON');
