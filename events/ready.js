const { Collection } = require("discord.js");
const fs = require("fs");

// Read in guild ID and my ID
const { guildId, myId } = require("../config.json");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // Delete all old slash commands
        const guildCommands = client.guilds.cache.get(guildId)?.commands;
        await guildCommands.fetch();
        guildCommands.cache.forEach((value, key) => guildCommands.delete(key));

        // Get slash commands
        const commandFiles = fs
            .readdirSync(__dirname + "/../slash")
            .filter((file) => file.endsWith(".js"));

        client.commands = new Collection();

        for (const file of commandFiles) {
            const commandInfo = require(`../slash/${file}`);

            // Register the command
            const command = await guildCommands.create(
                commandInfo.data.toJSON()
            );

            // Special treatment for functions that are private by default
            // Broken as of April 27, 2022, Permission V2 update
            // See https://stackoverflow.com/questions/72048570/403-error-when-setting-application-command-permissions-on-discord
            // if (commandInfo.giveMePermission) {
            //     await command.permissions.add({
            //         permissions: [
            //             {
            //                 id: myId,
            //                 type: "USER",
            //                 permission: true,
            //             },
            //         ],
            //     });
            // }

            // Set a new item in the Collection with the key as the command name and
            // the value as the exported module
            client.commands.set(commandInfo.data.name, commandInfo);
        }

        // Tell owner we're ready to go!
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
