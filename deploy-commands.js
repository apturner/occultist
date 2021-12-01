const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

// Get commands
const commandFiles = fs
    .readdirSync("./slash")
    .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
    const command = require(`./slash/${file}`);
    commands.push(command.data.toJSON());
}

// Register commands
const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
