const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');
const _ = require('lodash');

const games = JSON.parse(fs.readFileSync('games.json', 'utf8'));

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // Listen for messages that start with `o!`
    if (message.substring(0, 2) == 'o!') {
        var args = message.substring(2).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: games["1"].Script
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});