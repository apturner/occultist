const { codeBlock } = require("@discordjs/builders");
const sendMessage = require("./sendMessage");

async function printHelp(message, command) {
    await sendMessage(message, codeBlock(command.helpInformation()));
}

module.exports = printHelp;
