const { codeBlock } = require("@discordjs/builders");

async function printHelp(message, command) {
    await message.reply({
        content: codeBlock(command.helpInformation()),
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = printHelp;
