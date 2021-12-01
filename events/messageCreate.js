const { codeBlock } = require("@discordjs/builders");
const { Command } = require("commander");
const { prefix } = require("../config.json");

// Read in useful functions
const sendCodeBlock = require("../functions/sendCodeBlock");

// Read in files for message commands
const stToggle = require("../commands/stToggle");
const winRate = require("../commands/winRate");

// Define response to messages
module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // Build commands
        const occultist = new Command();

        // Settings for top level command
        occultist
            .name("!o")
            .addHelpCommand("help [command]", "Display help for command")
            .configureOutput({ writeOut: (str) => sendCodeBlock(message, str) })
            .exitOverride();

        // ST toggle command
        occultist
            .command("st")
            .description("Toggle whether the guild member has the ST role")
            .action(async (options, command) =>
                stToggle(message, options, command)
            )
            .configureOutput({ writeOut: (str) => sendCodeBlock(message, str) })
            .allowUnknownOption()
            .exitOverride();

        // Win rate command
        occultist
            .command("winrate")
            .description("Get the win rate for the specified player")
            .argument("<player>", "Player to find win rate of")
            // .option("-h, --help", "Display help for command")
            .action(async (player, options, command) =>
                winRate(message, player, options, command)
            )
            .allowUnknownOption()
            .exitOverride();

        // Cut off the prefix, trim, and split on whitespace
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        // Parse the arguments, controlling error handling ourselves
        try {
            await occultist.parseAsync(args, { from: "user" });
        } catch (err) {
            console.log(err);
            // await message.reply({
            //     content:
            //         "There was an error.\n" +
            //         codeBlock(occultist.helpInformation()),
            //     allowedMentions: {
            //         repliedUser: false,
            //     },
            // });
        }
    },
};
