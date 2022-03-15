const { Client, Intents } = require("discord.js");
const fs = require("fs");

// Read in token
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

// Read in games file and associate it with the client
const games = JSON.parse(fs.readFileSync("./data/games.json", "utf8"));
client.games = games;

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
