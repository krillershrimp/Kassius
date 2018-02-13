//---------------------------------------------------------------------
// Bot
// Contains functions for controlling the bot.
//---------------------------------------------------------------------

const Bot = {};

Bot.DBM = null;

const DiscordJS = require('discord.js');

Bot.$cmds = {};
Bot.$evts = {};

Bot.bot = null;

Bot.init = function() {
	this.initBot();
	this.reformatData();
	this.initEvents();
	this.login();
};

Bot.initBot = function() {
	this.bot = new DiscordJS.Client();
};

Bot.reformatData = function() {
	this.reformatCommands();
	this.reformatEvents();
};

Bot.reformatCommands = function() {
	const data = this.DBM.Files.data.commands;
	if(!data) return;
	for(let i = 0; i < data.length; i++) {
		const com = data[i];
		if(com) {
			if(this.DBM.Files.data.settings.case === 'false') {
				this.$cmds[com.name.toLowerCase()] = com;
			} else {
				this.$cmds[com.name] = com;
			}
		}
	}
};

Bot.reformatEvents = function() {
	const data = this.DBM.Files.data.events;
	if(!data) return;
	for(let i = 0; i < data.length; i++) {
		const com = data[i];
		if(com) {
			const type = com['event-type'];
			if(!this.$evts[type]) this.$evts[type] = [];
			this.$evts[type].push(com);
		}
	}
};

Bot.initEvents = function() {
	this.bot.on('ready', this.onReady.bind(this));
	this.bot.on('message', this.onMessage.bind(this));
	this.DBM.Events.registerEvents(this.bot);
};

Bot.login = function() {
	this.bot.login(process.env.BOT_TOKEN);
