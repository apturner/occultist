const { SlashCommandBuilder } = require("@discordjs/builders");
const { guildId } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};

// await interaction.deferReply();
//         const client = interaction.client;
//         // Set permission for the "orb" command
//         if (!client.application?.owner) await client.application?.fetch();
//         const commands = await client.guilds.cache.get(guildId)?.commands;
//         console.log(commands);
//         const commandsCache = commands.cache;
//         console.log(commandsCache);
//         const orb = await client.guilds.cache
//             .get(guildId)
//             ?.commands.cache.find((command) => command.name === "orb");
//         const permissions = [
//             {
//                 id: "222536204283936768", // Me
//                 type: "USER",
//                 permission: true,
//             },
//         ];
//         await orb.permissions.add({ permissions });
