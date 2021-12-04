const { codeBlock } = require("@discordjs/builders");
const { Command, Option } = require("commander");
const shlex = require("shlex");
const { prefix } = require("../config.json");

// Read in useful functions
const sendCodeBlock = require("../functions/sendCodeBlock");

// Read in files for message commands
const { defCount } = require("../commands/count");
const { defStToggle } = require("../commands/stToggle");
const { defWinRate } = require("../commands/winRate");

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
            .helpOption("-h, --help", "Display help for command")
            .configureHelp({ sortSubcommands: true, helpWidth: 1000 })
            .exitOverride();

        // Build subcommands
        defCount(occultist, message);
        defStToggle(occultist, message);
        defWinRate(occultist, message);

        // Cut off the prefix, trim, and split on whitespace not in quotes
        const args = shlex.split(message.content.slice(prefix.length).trim());
        // .match(/(?:[^\s'"]+|['"][^'"]*['"])+/g)
        // .map((str) => str.replace(/['"]/g, ""));

        // Parse the arguments, controlling error handling ourselves
        try {
            await occultist.parseAsync(args, { from: "user" });
        } catch (err) {
            if (
                err.code !== "commander.help" &&
                err.code !== "commander.helpDisplayed"
            ) {
                console.log(err);
                sendCodeBlock(
                    message,
                    occultist.commands
                        .find((comm) => comm._name === args[0])
                        .helpInformation()
                );
            }
        }
    },
};
