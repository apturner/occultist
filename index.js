// Require the necessary classes
const { Client, Collection, Intents } = require("discord.js");
const fs = require("fs");

// Read in token
const { token } = require("./config.json");

/*
==================================================
================ Running the bot =================
==================================================
*/

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Read in games file and associate it with the client
const games = JSON.parse(fs.readFileSync("./games.json", "utf8"));
client.games = games;

// Get slash commands
const commandFiles = fs
    .readdirSync("./slash")
    .filter((file) => file.endsWith(".js"));

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./slash/${file}`);

    // Set a new item in the Collection with the key as the command name and
    // the value as the exported module
    client.commands.set(command.data.name, command);
}

// Get and respond to events
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Login to Discord with client's token
client.login(token);
