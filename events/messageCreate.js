const { codeBlock } = require("@discordjs/builders");
const { Command, Option } = require("commander");
const { prefix } = require("../config.json");

// Read in useful functions
const sendCodeBlock = require("../functions/sendCodeBlock");

// Read in files for message commands
const { defStToggle, stToggle } = require("../commands/stToggle");
const { defWinRate, winRate } = require("../commands/winRate");

// Define response to messages
module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // Build top level command
        const occultist = new Command();
        occultist
            .name("!o")
            .configureOutput({ writeOut: (str) => sendCodeBlock(message, str) })
            .addHelpCommand("help [command]", "Display help for command")
            .helpOption("-h, --help", "Dislpay help for command")
            .configureHelp({ helpWidth: 1000 })
            .exitOverride();

        // Build subcommands
        defStToggle(occultist, message);
        defWinRate(occultist, message);

        // Cut off the prefix, trim, and split on whitespace
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        // Parse the arguments, controlling error handling ourselves
        try {
            await occultist.parseAsync(args, { from: "user" });
        } catch (err) {
            if (
                err.code !== "commander.help" &&
                err.code !== "commander.helpDisplayed"
            ) {
                console.log(err);
                sendCodeBlock(message, occultist.helpInformation());
            }
        }
    },
};
