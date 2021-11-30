// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

// Require some extra classes
const fs = require("fs");
const _ = require("lodash");

// Read in games file
const games = JSON.parse(fs.readFileSync("games.json", "utf8"));

/*
==================================================
============== Initializing the bot ==============
==================================================
*/

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready!");
});

// Login to Discord with your client's token
client.login(token);

/*
==================================================
=================== Functions ====================
==================================================
*/

// Functions for the bot
function getFinalRole(playerOrChange) {
    if (!_.has(playerOrChange, "Change")) {
        return {
            Character: playerOrChange.Character,
            Alignment: playerOrChange.Alignment,
        };
    } else {
        return getFinalRole(playerOrChange.Change);
    }
}

/*
==================================================
================ Running the bot =================
==================================================
*/

// Run the actual bot
// bot.on("message", function (user, userID, channelID, message, evt) {
//     // Our bot needs to know if it will execute a command
//     // Listen for messages that start with `o!`
//     if (message.substring(0, 2) == "o!") {
//         var args = message.substring(2).split(" ");
//         var cmd = args[0];

//         args = args.splice(1);
//         switch (cmd) {
//             // !ping
//             case "ping":
//                 bot.sendMessage({
//                     to: channelID,
//                     message: games["1"].Script,
//                 });
//                 break;
//             case "winrate":
//                 bot.sendMessage({
//                     to: channelID,
//                     message: "",
//                     embed: {
//                         color: 6826080,
//                         footer: {
//                             text:
//                                 "This is a rather long footer, to get a sense of how the formatting works here",
//                         },
//                         thumbnail: {
//                             url:
//                                 "https://upload.wikimedia.org/wikipedia/commons/0/05/Numbat.jpg",
//                         },
//                         title:
//                             "This is also a rather long title, to get a sense of how the formatting works here",
//                         url: "https://en.wikipedia.org/wiki/Numbat",
//                     },
//                 });
//                 break;
//             case "ST":
//                 bot.sendMessage({
//                     to: channelID,
//                     message: user,
//                 });
//                 break;
//             case "do":
//                 var allUsers = bot.getAllUsers();
//                 logger.info(Object.prototype.toString.call(allUsers));
//                 bot.sendMessage({
//                     to: channelID,
//                     message: allUsers,
//                 });
//                 break;
//         }
//     }
// });
